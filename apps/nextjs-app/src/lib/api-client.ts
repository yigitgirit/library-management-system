import axios, { AxiosError, InternalAxiosRequestConfig, ParamsSerializerOptions } from "axios"
import { API_CONFIG } from "@/config/api"
import { refreshSessionAction, logoutAction } from "@/app/actions/auth"
import { ApiErrorResponse, AppError } from "@/types/api"
import { serverApiClient } from "./api-client/server-client"

const browserClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
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

browserClient.interceptors.request.use((config) => {
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
    
    console.log(`[BrowserClient] Request: ${config.method?.toUpperCase()} ${fullUrl}${query}`)
    return config
})

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

browserClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {

      if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise<string | null>(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (token) {
                originalRequest.headers["Authorization"] = "Bearer " + token
            }
            return browserClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const result = await refreshSessionAction()
        if (result.success && result.accessToken) {
          browserClient.defaults.headers.common["Authorization"] = "Bearer " + result.accessToken
          originalRequest.headers["Authorization"] = "Bearer " + result.accessToken
          processQueue(null, result.accessToken)
          return browserClient(originalRequest)
        }
        throw new Error("Refresh failed")
      } catch (err) {
        processQueue(err, null)
        await logoutAction()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    if (axios.isAxiosError(error) && error.response?.data) {
      const responseData = error.response.data as unknown
      
      if (typeof responseData === 'object' && responseData !== null) {
          const data = responseData as Record<string, unknown>

          if ('success' in data && data.success === false && 'error' in data) {
             const apiError = data.error as ApiErrorResponse
             if (apiError) {
                 return Promise.reject(new AppError(apiError))
             }
          }

          if ('code' in data && 'message' in data) {
            return Promise.reject(new AppError(data as unknown as ApiErrorResponse))
          }
      }
    }

    return Promise.reject(error)
  }
)

export const apiClient = typeof window === 'undefined' ? serverApiClient : browserClient
