import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, ParamsSerializerOptions } from "axios"
import { AppError, ApiErrorResponse } from "@/types/api"

// Token provider signature
export type TokenProvider = () => Promise<string | null | undefined>

// Error handler signature (allows custom error handling per environment)
export type ErrorHandler = (error: AxiosError) => Promise<unknown>

export interface ApiClientOptions {
  baseURL: string
  headers?: Record<string, string>
  timeout?: number
  tokenProvider?: TokenProvider
  errorHandler?: ErrorHandler
}

export const createApiClient = ({
  baseURL,
  headers = {},
  timeout = 10000,
  tokenProvider,
  errorHandler
}: ApiClientOptions): AxiosInstance => {

  const client = axios.create({
    baseURL,
    timeout,
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    paramsSerializer: {
      serialize: (params) => {
        const searchParams = new URLSearchParams()
        for (const key in params) {
          const value = params[key]
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, String(v)))
          } else if (value !== undefined && value !== null) {
            searchParams.append(key, String(value))
          }
        }
        return searchParams.toString()
      },
    },
  })

  // Request Interceptor: Logging & Token Injection
  client.interceptors.request.use(async (config) => {
    // Inject Token if provider exists
    if (tokenProvider) {
      try {
        const token = await tokenProvider()
        // Only inject token if it exists AND the request is NOT for the refresh endpoint
        // This prevents sending an expired access token to the refresh endpoint, which might confuse the backend
        if (token && !config.url?.includes("/auth/refresh")) {
            config.headers.Authorization = `Bearer ${token}`
        }
      } catch (error) {
        // Token provider failed (e.g. outside request context), proceed without token
      }
    }

    // Logging
    const baseUrl = config.baseURL || ""
    const url = config.url || ""
    const fullUrl = baseUrl + url

    let query = ""
    if (config.params) {
        const serializer = config.paramsSerializer as ParamsSerializerOptions | undefined
        if (serializer && typeof serializer === 'object' && serializer.serialize) {
             query = "?" + serializer.serialize(config.params)
        }
    }

    // Use a simpler log format or conditional logging based on env
    if (process.env.NODE_ENV === 'development') {
        console.log(`[API] ${config.method?.toUpperCase()} ${fullUrl}${query}`)
    }

    return config
  })

  // Response Interceptor: Error Handling
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      // 1. If custom error handler is provided (e.g. for Refresh Token flow), use it
      if (errorHandler) {
        try {
            return await errorHandler(error)
        } catch (e) {
            // If handler re-throws, fall through to default error parsing
            error = e as AxiosError
        }
      }

      // 2. Default Error Parsing (AppError conversion)
      if (axios.isAxiosError(error) && error.response?.data) {
        const responseData = error.response.data as unknown

        if (typeof responseData === 'object' && responseData !== null) {
            const data = responseData as Record<string, unknown>

            // Handle standard API error response structure
            if ('success' in data && data.success === false && 'error' in data) {
               const apiError = data.error as ApiErrorResponse
               if (apiError) {
                   return Promise.reject(new AppError(apiError))
               }
            }

            // Handle direct error object (fallback)
            if ('code' in data && 'message' in data) {
              // Type assertion is safer here as we checked properties
              return Promise.reject(new AppError(data as unknown as ApiErrorResponse))
            }
        }
      }

      // 3. Fallback for generic errors
      return Promise.reject(error)
    }
  )

  return client
}
