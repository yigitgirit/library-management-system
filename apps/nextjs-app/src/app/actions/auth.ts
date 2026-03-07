"use server"

import { cookies } from "next/headers"
import { loginSchema, registerSchema, LoginInput, RegisterInput } from "@/features/auth/schemas"
import { authService } from "@/features/auth/services/authService"
import {AppError, ErrorCodes} from "@/types/api"
import {AuthResponse} from "@/features/auth/types/auth";

export type ActionResponse = {
  success: boolean
  error?: string
  errorCode?: string
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
    return {
      success: false,
      error: error.message,
      errorCode: error.code,
      validationErrors
    }
  }
  return {
    success: false,
    error: (error as Error).message || "An unexpected error occurred",
    errorCode: ErrorCodes.INTERNAL_SERVER_ERROR
  }
}

export async function loginAction(data: LoginInput): Promise<ActionResponse> {
  const result = loginSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      error: "Invalid input",
      errorCode: ErrorCodes.VALIDATION_ERROR
    }
  }

  try {
    const response: AuthResponse = await authService.login({
      email: result.data.email,
      password: result.data.password,
    })

    if (response.accessToken) {
      await setAuthCookies(response.accessToken, response.refreshToken)
      return { success: true }
    }

    return {
      success: false,
      error: "Login failed: No access token received",
      errorCode: ErrorCodes.INVALID_CREDENTIALS
    }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function registerAction(data: RegisterInput): Promise<ActionResponse> {
  const result = registerSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      error: "Invalid input",
      errorCode: ErrorCodes.VALIDATION_ERROR
    }
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
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get("refreshToken")?.value

  if (!refreshToken) {
    return {
      success: false,
      error: "No refresh token found",
      errorCode: ErrorCodes.REFRESH_TOKEN_NOT_FOUND
    }
  }

  try {
    const response = await authService.refresh({ refreshToken })

    if (response.accessToken) {
      await setAuthCookies(response.accessToken, response.refreshToken)
      return { success: true, accessToken: response.accessToken }
    }

    return {
      success: false,
      error: "Refresh failed: No access token received",
      errorCode: ErrorCodes.REFRESH_TOKEN_EXPIRED
    }
  } catch (error) {
    try {
        await clearAuthCookies()
    } catch (cookieError) {
        console.error("Failed to clear cookies during refresh failure:", cookieError)
    }

    return { success: false, error: "Refresh failed" }
  }
}
