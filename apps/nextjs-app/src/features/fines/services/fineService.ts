import { apiClient } from "@/lib/api-client"
import { ApiResponse } from "@/types/api"
import { Fine, FineSearchParams } from "../types/fine"
import { FineCreateInput } from "../schemas/fine"
import {PagedData} from "@/types/pagedData";

export const fineService = {
  getAll: async (params: FineSearchParams): Promise<PagedData<Fine>> => {
    const response = await apiClient.get<ApiResponse<PagedData<Fine>>>("/api/management/fines", {
      params,
    })
    return response.data.data!
  },

  getById: async (id: number): Promise<Fine> => {
    const response = await apiClient.get<ApiResponse<Fine>>(`/api/management/fines/${id}`)
    return response.data.data!
  },

  create: async (data: FineCreateInput): Promise<Fine> => {
    const response = await apiClient.post<ApiResponse<Fine>>("/api/management/fines", data)
    return response.data.data!
  },

  pay: async (id: number): Promise<Fine> => {
    // Public endpoint for paying fines
    const response = await apiClient.post<ApiResponse<Fine>>(`/api/fines/${id}/pay`, {
        paymentMethod: "CREDIT_CARD" // Mock payment method
    })
    return response.data.data!
  },

  // Waive endpoint is currently missing in backend FineManagementController
  waive: async (id: number): Promise<Fine> => {
    // Placeholder: potentially use patch to set status to WAIVED if backend supports it
    // For now, we'll keep the endpoint structure in case it's added
    const response = await apiClient.post<ApiResponse<Fine>>(`/api/management/fines/${id}/waive`)
    return response.data.data!
  },
}
