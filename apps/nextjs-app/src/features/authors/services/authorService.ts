import { apiClient } from "@/lib/api-client"
import { ApiResponse } from "@/types/api"
import { Author, AuthorSearchParams } from "../types/author"
import { AuthorCreateInput, AuthorUpdateInput } from "../schemas/author"
import {PagedData} from "@/types/pagedData";

export const authorService = {
  getAll: async (params: AuthorSearchParams): Promise<PagedData<Author>> => {
    const response = await apiClient.get<ApiResponse<PagedData<Author>>>("/api/authors", {
      params,
    })
    return response.data.data!
  },

  getById: async (id: number): Promise<Author> => {
    const response = await apiClient.get<ApiResponse<Author>>(`/api/authors/${id}`)
    return response.data.data!
  },

  create: async (data: AuthorCreateInput): Promise<Author> => {
    const response = await apiClient.post<ApiResponse<Author>>("/api/management/authors", data)
    return response.data.data!
  },

  update: async ({ id, data }: { id: number; data: AuthorUpdateInput }): Promise<Author> => {
    const response = await apiClient.put<ApiResponse<Author>>(`/api/management/authors/${id}`, data)
    return response.data.data!
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/management/authors/${id}`)
  },
}
