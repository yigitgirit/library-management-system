import { apiClient } from "@/lib/api-client"
import { ApiResponse } from "@/types/api"
import { Category, CategorySearchParams } from "../types/category"
import { CategoryCreateInput, CategoryUpdateInput } from "../schemas/category"
import {PagedData} from "@/types/pagedData";

export const categoryService = {
  getAll: async (params: CategorySearchParams): Promise<PagedData<Category>> => {
    const response = await apiClient.get<ApiResponse<PagedData<Category>>>("/api/categories", {
      params,
    })
    return response.data.data!
  },

  getById: async (id: number): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/api/categories/${id}`)
    return response.data.data!
  },

  create: async (data: CategoryCreateInput): Promise<Category> => {
    const response = await apiClient.post<ApiResponse<Category>>("/api/management/categories", data)
    return response.data.data!
  },

  update: async ({ id, data }: { id: number; data: CategoryUpdateInput }): Promise<Category> => {
    const response = await apiClient.put<ApiResponse<Category>>(`/api/management/categories/${id}`, data)
    return response.data.data!
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/management/categories/${id}`)
  },
}
