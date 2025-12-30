"use server"

import "@/lib/api-client/api-config" // Import configuration to set API base URL
import { cookies } from "next/headers"
import { AuthControllerService } from "@/lib/api"
import { loginSchema, registerSchema, LoginInput, RegisterInput } from "@/features/auth/schemas"
import { OpenAPI } from "@/lib/api/core/OpenAPI"
import { handleApiError } from "@/lib/api-client/api-utils"

export type ActionResponse = {
  success: boolean
  error?: string
  validationErrors?: Record<string, string>
  accessToken?: string
}

export async function loginAction(data: LoginInput): Promise<ActionResponse> {
  console.log("Login action started with email:", data.email)
  const result = loginSchema.safeParse(data)

  if (!result.success) {
    console.error("Login validation failed:", result.error)
    return { success: false, error: "Invalid input" }
  }

  try {
    // Ensure we are NOT sending any stale token from the server's global state
    OpenAPI.TOKEN = undefined; 

    console.log("Calling AuthControllerService.login...")
    const response = await AuthControllerService.login({
      requestBody: {
        email: result.data.email,
        password: result.data.password,
      }})
    console.log("Login API response received:", response)

    if (response.data?.accessToken) {
      console.log("Access token found, setting cookies...")
      const cookieStore = await cookies()
      
      cookieStore.set("accessToken", response.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      })
      console.log("accessToken cookie set")
      
      if (response.data.refreshToken) {
         cookieStore.set("refreshToken", response.data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
         })
         console.log("refreshToken cookie set")
      }
      return { success: true }
    }

    console.error("Login failed: No access token in response data")
    return { success: false, error: "Login failed: No access token received" }
  } catch (error) {
    console.error("Login action error:", error)
    const { message, validationErrors } = handleApiError(error);
    return { success: false, error: message, validationErrors }
  }
}

export async function registerAction(data: RegisterInput): Promise<ActionResponse> {
  const result = registerSchema.safeParse(data)

  if (!result.success) {
    return { success: false, error: "Invalid input" }
  }

  try {
    // Ensure we are NOT sending any stale token from the server's global state
    OpenAPI.TOKEN = undefined;

    await AuthControllerService.register({
      requestBody: {
         firstName: result.data.firstName,
         lastName: result.data.lastName,
         email: result.data.email,
         password: result.data.password,
        }
    })

    return { success: true }
  } catch (error) {
    const { message, validationErrors } = handleApiError(error);
    return { success: false, error: message, validationErrors }
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  const refreshToken = cookieStore.get("refreshToken")?.value

  if (accessToken && refreshToken) {
    try {
        OpenAPI.TOKEN = accessToken;
        
        await AuthControllerService.logout({
          requestBody: {refreshToken: refreshToken
        }})
    } catch (error) {
        console.error("Logout failed on server:", error)
    }
  }

  cookieStore.delete("accessToken")
  cookieStore.delete("refreshToken")
}

export async function refreshSessionAction(): Promise<ActionResponse> {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get("refreshToken")?.value

  if (!refreshToken) {
    return { success: false, error: "No refresh token found" }
  }

  try {
    // We don't need the access token to call refresh endpoint, usually it's public or requires only refresh token
    OpenAPI.TOKEN = undefined;

    const response = await AuthControllerService.refresh({
      requestBody: {refreshToken: refreshToken}
    })

    if (response.data?.accessToken) {
      cookieStore.set("accessToken", response.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      })
      
      if (response.data.refreshToken) {
         cookieStore.set("refreshToken", response.data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
         })
      }
      
      return { success: true, accessToken: response.data.accessToken }
    }
    
    return { success: false, error: "Refresh failed" }
  } catch (error) {
    console.error("Refresh action error:", error)
    // If refresh fails, clear cookies
    cookieStore.delete("accessToken")
    cookieStore.delete("refreshToken")
    return { success: false, error: "Refresh failed" }
  }
}
