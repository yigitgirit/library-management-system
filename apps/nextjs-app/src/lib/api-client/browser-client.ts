import {createApiClient, ErrorHandler} from "./base-client"
import { API_CONFIG } from "@/config/api"
import { refreshSessionAction, logoutAction } from "@/app/actions/auth"
import { AxiosError, InternalAxiosRequestConfig } from "axios"
import {AppError, ErrorCodes} from "@/types/api";

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

// Queue for failed requests during token refresh
interface QueuedRequest {
  resolve: (token: string | null) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: QueuedRequest[] = []

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error)
        } else {
            resolve(token)
        }
    })
    failedQueue = []
}

// Token refresh utilities
const shouldSkipRefresh = (requestUrl?: string): boolean => {
    if (!requestUrl) return true
    return requestUrl.includes("/auth/login") || requestUrl.includes("/auth/refresh")
}

const createQueuedRequestPromise = (): Promise<string | null> => {
    return new Promise<string | null>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
    })
}

// Main error handling logic
const handleUnauthorizedError = async (
    error: AxiosError,
    originalRequest: ExtendedAxiosRequestConfig
): Promise<unknown> => {
    if (shouldSkipRefresh(originalRequest.url)) {
        throw error
    }

    // Handle concurrent refresh requests
    if (isRefreshing) {
        const token = await createQueuedRequestPromise()
        if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`
            originalRequest._retry = true
            return browserClient(originalRequest)
        }
        throw error
    }

    // Start refresh process
    originalRequest._retry = true
    isRefreshing = true

    try {
        const result = await refreshSessionAction()

        if (result.success && result.accessToken) {
            // Update authorization for future requests
            browserClient.defaults.headers.common.Authorization = `Bearer ${result.accessToken}`

            // Update current request
            originalRequest.headers.Authorization = `Bearer ${result.accessToken}`

            // Process queued requests
            processQueue(null, result.accessToken)

            // Retry original request
            return browserClient(originalRequest)
        } else {
            // Handle business logic failure
            const refreshError = new AppError({
                code: result.errorCode || "UNKNOWN_ERROR",
                message: result.error || "Token refresh failed"
            })

            // Process queued requests
            processQueue(refreshError, null)
            await logoutAction()
            throw refreshError
        }
    } catch (error) {
        // Handle both network errors and business logic errors
        const errorToThrow = error instanceof AppError
            ? error
            : new AppError({
                code: "NETWORK_ERROR",
                message: error instanceof Error
                    ? error.message
                    : "Network error during token refresh"
            })

        processQueue(errorToThrow, null)
        await logoutAction()
        throw errorToThrow
    } finally {
        isRefreshing = false
    }
}

// Browser-side error handler with Refresh Token logic
const browserErrorHandler: ErrorHandler = async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        return handleUnauthorizedError(error, originalRequest)
    }

    // Pass through to base client error handling
    throw error
}

export const browserClient = createApiClient({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  // Browser automatically sends cookies for same-origin requests (Next.js proxy).
  // If there is need to send token in header for direct backend access:
  // tokenProvider: async () => { ... get from memory/cookie ... }
  errorHandler: browserErrorHandler
})
