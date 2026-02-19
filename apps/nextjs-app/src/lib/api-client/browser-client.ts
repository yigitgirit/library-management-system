import { createApiClient } from "./base-client"
import { API_CONFIG } from "@/config/api"
import { refreshSessionAction, logoutAction } from "@/app/actions/auth"
import { AxiosError, InternalAxiosRequestConfig } from "axios"

// Queue for failed requests during token refresh
interface RetryQueueItem {
  resolve: (token: string | null) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: RetryQueueItem[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Browser-side error handler with Refresh Token logic
const browserErrorHandler = async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    console.log(`[BrowserClient] Error intercepted: ${error.message}`, {
        url: originalRequest?.url,
        status: error.response?.status,
        isRetry: originalRequest?._retry,
        isRefreshing
    })

    // Check for 401 Unauthorized
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {

      // Don't retry login or refresh endpoints to avoid infinite loops
      if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh")) {
        console.log("[BrowserClient] 401 on login/refresh, skipping retry")
        throw error
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        console.log("[BrowserClient] Already refreshing, queuing request:", originalRequest.url)
        return new Promise<string | null>(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (token) {
                console.log("[BrowserClient] Retrying queued request with new token:", originalRequest.url)
                originalRequest.headers["Authorization"] = "Bearer " + token
            }
            return browserClient(originalRequest)
          })
          .catch((err) => {
            throw err
          })
      }

      originalRequest._retry = true
      isRefreshing = true
      console.log("[BrowserClient] Starting refresh flow...")

      try {
        // Call Server Action to refresh token (HttpOnly cookie)
        const result = await refreshSessionAction()
        console.log("[BrowserClient] Refresh result:", result)

        if (result.success && result.accessToken) {
          console.log("[BrowserClient] Refresh successful, updating headers and retrying")
          
          // Update default headers for future requests
          browserClient.defaults.headers.common["Authorization"] = "Bearer " + result.accessToken

          // Update current request headers
          originalRequest.headers["Authorization"] = "Bearer " + result.accessToken

          // Process queued requests
          processQueue(null, result.accessToken)

          // Retry original request
          return browserClient(originalRequest)
        }

        console.error("[BrowserClient] Refresh failed (no success or token)")
        throw new Error("Refresh failed")
      } catch (err) {
        console.error("[BrowserClient] Refresh flow error:", err)
        processQueue(err, null)
        await logoutAction()
        throw err
      } finally {
        isRefreshing = false
      }
    }

    // If not 401 or retry failed, re-throw to let base-client handle AppError conversion
    throw error
}

export const browserClient = createApiClient({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  // Browser automatically sends cookies for same-origin requests (Next.js proxy).
  // If you need to send token in header for direct backend access:
  // tokenProvider: async () => { ... get from memory/cookie ... }
  errorHandler: browserErrorHandler
})
