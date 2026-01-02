import { apiClient } from "@/lib/api-client"
import { ApiResponse } from "@/types/api"
import { Book, BookSearchParams } from "../types/book"
import { BookCreateInput, BookUpdateInput } from "../schemas/book"
import {PagedData} from "@/types/pagedData";

export const bookService = {
  getAll: async (params: BookSearchParams): Promise<PagedData<Book>> => {
    const response = await apiClient.get<ApiResponse<PagedData<Book>>>("/api/books", {
      params,
    })
    return response.data.data!
  },

  getById: async (id: number): Promise<Book> => {
    const response = await apiClient.get<ApiResponse<Book>>(`/api/books/${id}`)
    return response.data.data!
  },

  create: async (data: BookCreateInput): Promise<Book> => {
    const response = await apiClient.post<ApiResponse<Book>>("/api/management/books", data)
    return response.data.data!
  },

  update: async ({ id, data }: { id: number; data: BookUpdateInput }): Promise<Book> => {
    const response = await apiClient.put<ApiResponse<Book>>(`/api/management/books/${id}`, data)
    return response.data.data!
  },

  patch: async ({ id, data }: { id: number; data: Partial<BookUpdateInput> }): Promise<Book> => {
    const response = await apiClient.patch<ApiResponse<Book>>(`/api/management/books/${id}`, data)
    return response.data.data!
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/management/books/${id}`)
  },
}
