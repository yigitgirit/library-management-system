import { serverApiClient } from "@/lib/api-client/server-client"
import { LoginRequest, RegisterRequest, AuthResponse, RefreshTokenRequest } from "../types/auth"
import { ApiResponse } from "@/types/api"

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await serverApiClient.post<ApiResponse<AuthResponse>>("/api/auth/login", data)
    return response.data.data!
  },

  register: async (data: RegisterRequest): Promise<void> => {
    await serverApiClient.post<ApiResponse<void>>("/api/auth/register", data)
  },

  logout: async (data: RefreshTokenRequest, accessToken: string): Promise<void> => {
    await serverApiClient.post<ApiResponse<void>>("/api/auth/logout", data, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
  },

  refresh: async (data: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await serverApiClient.post<ApiResponse<AuthResponse>>("/api/auth/refresh", data)
    return response.data.data!
  }
}
