import { apiClient } from "@/lib/api-client"
import { ApiResponse } from "@/types/api"
import { Review, ReviewSearchParams } from "../types/review"
import { ReviewCreateInput, ReviewUpdateInput } from "../schemas/review"
import { PagedData } from "@/types/pagedData"

export const reviewService = {
  // Public endpoints - anyone can view
  getReviewsByBook: async (
    bookId: number,
    params?: Omit<ReviewSearchParams, "bookId">
  ): Promise<PagedData<Review>> => {
    const page = params?.page ? params.page - 1 : 0
    const response = await apiClient.get<ApiResponse<PagedData<Review>>>(
      `/api/books/${bookId}/reviews`,
      {
        params: { ...params, page: Math.max(0, page) },
      }
    )
    return response.data.data!
  },

  getReviewById: async (id: number): Promise<Review> => {
    const response = await apiClient.get<ApiResponse<Review>>(`/api/reviews/${id}`)
    return response.data.data!
  },

  getMyReviewForBook: async (bookId: number): Promise<Review | null> => {
    const response = await apiClient.get<ApiResponse<Review | null>>(`/api/books/${bookId}/reviews/me`)
    return response.data.data ?? null
  },

  createReview: async (data: ReviewCreateInput): Promise<Review> => {
    const response = await apiClient.post<ApiResponse<Review>>("/api/reviews", data)
    return response.data.data!
  },

  updateReview: async ({
    id,
    data,
  }: {
    id: number
    data: ReviewUpdateInput
  }): Promise<Review> => {
    const response = await apiClient.put<ApiResponse<Review>>(`/api/reviews/${id}`, data)
    return response.data.data!
  },

  deleteReview: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/reviews/${id}`)
  },

  getMyReviews: async (
    params?: Omit<ReviewSearchParams, "userId">
  ): Promise<PagedData<Review>> => {
    const page = params?.page ? params.page - 1 : 0
    const response = await apiClient.get<ApiResponse<PagedData<Review>>>(
      "/api/reviews/my-reviews",
      {
        params: { ...params, page: Math.max(0, page) },
      }
    )
    return response.data.data!
  },

  // Admin endpoints
  getAllReviews: async (params?: ReviewSearchParams): Promise<PagedData<Review>> => {
    const page = params?.page ? params.page - 1 : 0
    const response = await apiClient.get<ApiResponse<PagedData<Review>>>(
      "/api/management/reviews",
      {
        params: { ...params, page: Math.max(0, page) },
      }
    )
    return response.data.data!
  },

  deleteReviewAsAdmin: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/management/reviews/${id}`)
  },
}
