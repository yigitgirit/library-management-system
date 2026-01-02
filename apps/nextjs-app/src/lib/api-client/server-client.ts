import axios, { AxiosError, ParamsSerializerOptions } from "axios"
import { AppError, ApiResponse } from "@/types/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export const serverApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
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

serverApiClient.interceptors.request.use((config) => {
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
    
    console.log(`[ServerClient] Request: ${config.method?.toUpperCase()} ${fullUrl}${query}`)
    return config
})

serverApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response?.data?.error) {
      throw new AppError(error.response.data.error)
    }
    
    throw new Error(error.message || "An unexpected error occurred")
  }
)
