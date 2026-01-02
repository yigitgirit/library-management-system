import { apiClient } from "@/lib/api-client"
import { ApiResponse } from "@/types/api"
import { 
  User, 
  UserSearchParams, 
  UserPrivateProfile, 
  UserPublicProfile,
  UserCreateRequest,
  UserUpdateRequest,
  UserEditProfileRequest,
  ChangePasswordRequest
} from "../types/user"
import {PagedData} from "@/types/pagedData";

export const userService = {
  // Management Endpoints
  getAll: async (params: UserSearchParams): Promise<PagedData<User>> => {
    const response = await apiClient.get<ApiResponse<PagedData<User>>>("/api/management/users", {
      params,
    })
    return response.data.data!
  },

  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/api/management/users/${id}`)
    return response.data.data!
  },

  create: async (data: UserCreateRequest): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>("/api/management/users", data)
    return response.data.data!
  },

  update: async ({ id, data }: { id: number; data: UserUpdateRequest }): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/api/management/users/${id}`, data)
    return response.data.data!
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/management/users/${id}`)
  },

  ban: async ({ id, reason }: { id: number; reason: string }): Promise<void> => {
    await apiClient.post(`/api/management/users/${id}/ban`, { reason })
  },

  unban: async (id: number): Promise<void> => {
    await apiClient.post(`/api/management/users/${id}/unban`)
  },

  // Profile Endpoints
  getMyProfile: async (): Promise<UserPrivateProfile> => {
    const response = await apiClient.get<ApiResponse<UserPrivateProfile>>("/api/users/me")
    return response.data.data!
  },

  getUserPublicProfile: async (id: number): Promise<UserPublicProfile> => {
    const response = await apiClient.get<ApiResponse<UserPublicProfile>>(`/api/users/${id}`)
    return response.data.data!
  },

  editMyProfile: async (data: UserEditProfileRequest): Promise<UserPrivateProfile> => {
    const response = await apiClient.put<ApiResponse<UserPrivateProfile>>("/api/users/me", data)
    return response.data.data!
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
      await apiClient.post("/api/users/me/password", data)
  }
}
