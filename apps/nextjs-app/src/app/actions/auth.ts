"use server"

import { cookies } from "next/headers"
import { loginSchema, registerSchema, LoginInput, RegisterInput } from "@/features/auth/schemas"
import { authService } from "@/features/auth/services/authService"
import { AppError } from "@/types/api"

export type ActionResponse = {
  success: boolean
  error?: string
  validationErrors?: Record<string, string>
  accessToken?: string
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
}

async function setAuthCookies(accessToken: string, refreshToken?: string) {
  const cookieStore = await cookies()
  
  cookieStore.set("accessToken", accessToken, COOKIE_OPTIONS)
  
  if (refreshToken) {
    cookieStore.set("refreshToken", refreshToken, COOKIE_OPTIONS)
  }
}

async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.delete("accessToken")
  cookieStore.delete("refreshToken")
}

function handleActionError(error: unknown): ActionResponse {
  if (error instanceof AppError) {
    const validationErrors: Record<string, string> = {}
    if (error.details) {
      error.details.forEach(d => {
        validationErrors[d.field] = d.message
      })
    }
    return { success: false, error: error.message, validationErrors }
  }
  return { success: false, error: (error as Error).message || "An unexpected error occurred" }
}

export async function loginAction(data: LoginInput): Promise<ActionResponse> {
  const result = loginSchema.safeParse(data)

  if (!result.success) {
    return { success: false, error: "Invalid input" }
  }

  try {
    const response = await authService.login({
      email: result.data.email,
      password: result.data.password,
    })

    if (response.accessToken) {
      await setAuthCookies(response.accessToken, response.refreshToken)
      return { success: true }
    }

    return { success: false, error: "Login failed: No access token received" }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function registerAction(data: RegisterInput): Promise<ActionResponse> {
  const result = registerSchema.safeParse(data)

  if (!result.success) {
    return { success: false, error: "Invalid input" }
  }

  try {
    await authService.register({
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      email: result.data.email,
      password: result.data.password,
    })

    return { success: true }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  const refreshToken = cookieStore.get("refreshToken")?.value

  if (accessToken && refreshToken) {
    try {
      await authService.logout({ refreshToken }, accessToken)
    } catch (error) {
      // Ignore logout errors
    }
  }

  await clearAuthCookies()
}

export async function refreshSessionAction(): Promise<ActionResponse> {
  console.log("[AuthAction] refreshSessionAction called")
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get("refreshToken")?.value

  if (!refreshToken) {
    console.log("[AuthAction] No refresh token found in cookies")
    return { success: false, error: "No refresh token found" }
  }

  try {
    console.log("[AuthAction] Calling authService.refresh...")
    const response = await authService.refresh({ refreshToken })
    console.log("[AuthAction] Refresh successful, new access token received")

    if (response.accessToken) {
      await setAuthCookies(response.accessToken, response.refreshToken)
      return { success: true, accessToken: response.accessToken }
    }
    
    return { success: false, error: "Refresh failed" }
  } catch (error) {
    console.error("[AuthAction] Refresh failed with error:", error)
    try {
        await clearAuthCookies()
    } catch (cookieError) {
        console.error("Failed to clear cookies during refresh failure:", cookieError)
    }

    return { success: false, error: "Refresh failed" }
  }
}
