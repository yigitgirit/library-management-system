import { apiClient } from "@/lib/api-client"
import { ApiResponse } from "@/types/api"
import { Copy, CopySearchParams } from "../types/copy"
import { CopyCreateInput, CopyUpdateInput } from "../schemas/copy"
import {PagedData} from "@/types/pagedData";

export const copyService = {
  getAll: async (params: CopySearchParams): Promise<PagedData<Copy>> => {
    const response = await apiClient.get<ApiResponse<PagedData<Copy>>>("/api/copies", {
      params,
    })
    return response.data.data!
  },

  getById: async (id: number): Promise<Copy> => {
    const response = await apiClient.get<ApiResponse<Copy>>(`/api/copies/${id}`)
    return response.data.data!
  },

  create: async (data: CopyCreateInput): Promise<Copy> => {
    const response = await apiClient.post<ApiResponse<Copy>>("/api/management/copies", data)
    return response.data.data!
  },

  update: async ({ id, data }: { id: number; data: CopyUpdateInput }): Promise<Copy> => {
    const response = await apiClient.put<ApiResponse<Copy>>(`/api/management/copies/${id}`, data)
    return response.data.data!
  },

  retire: async (id: number): Promise<void> => {
    await apiClient.post(`/api/management/copies/${id}/retire`)
  },
}
