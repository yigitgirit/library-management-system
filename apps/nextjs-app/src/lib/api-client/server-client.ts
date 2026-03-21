import { createApiClient } from "./base-client"
import { AppError } from "@/types/api"
import { AxiosError } from "axios"
import { API_CONFIG } from "@/config/api"

// Cache for dynamic imports to prevent repeated loading
let cookiesPromise: Promise<typeof import("next/headers")> | null = null

// Get cookies module with caching
const getCookieModule = async () => {
    if (!cookiesPromise) {
        cookiesPromise = import("next/headers")
    }
    return cookiesPromise
}

// Server-side token provider using Next.js cookies
const serverTokenProvider = async () => {
  try {
      // Dynamic import of cookies from next/headers
    const { cookies } = await getCookieModule()
    const cookieStore = await cookies()
    return cookieStore.get("accessToken")?.value
  } catch (error) {
    // This happens if called outside of request context like SSG
    return null
  }
}

// Server-side error handler
const serverErrorHandler = async (error: AxiosError) => {
    const responseData = error.response?.data;
    if (responseData && typeof responseData === 'object' && 'error' in responseData) {
        const apiError = (responseData as { error: unknown }).error;
        if (apiError && typeof apiError === 'object' && 'code' in apiError && 'message' in apiError) {
            throw new AppError(apiError as AppError);
        }
    }

    throw new AppError({
        code: error.code || "NETWORK_ERROR",
        message: error.response 
            ? `Server responded with ${error.response.status}`
            : "Cannot connect to the backend server. It might be offline.",
    })
}

export const serverApiClient = createApiClient({
  baseURL: API_CONFIG.BASE_URL,
  tokenProvider: serverTokenProvider,
  errorHandler: serverErrorHandler
})
