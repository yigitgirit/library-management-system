import { apiClient } from "@/lib/api-client"
import { ApiResponse } from "@/types/api"
import { Loan, LoanSearchParams, LoanUserSummaryDto } from "../types/loan"
import { LoanCreateInput, LoanReportDamagedInput } from "../schemas/loan"
import {PagedData} from "@/types/pagedData";

export const loanService = {
  getAll: async (params: LoanSearchParams): Promise<PagedData<Loan>> => {
    const response = await apiClient.get<ApiResponse<PagedData<Loan>>>("/api/management/loans", {
      params,
    })
    return response.data.data!
  },

  getMyLoans: async (): Promise<PagedData<LoanUserSummaryDto>> => {
    const response = await apiClient.get<ApiResponse<PagedData<LoanUserSummaryDto>>>("/api/loans/my-loans", {
      params: {
        size: 1000,
        sort: "loanDate,desc",
      },
    })
    return response.data.data!
  },

  getById: async (id: number): Promise<Loan> => {
    const response = await apiClient.get<ApiResponse<Loan>>(`/api/management/loans/${id}`)
    return response.data.data!
  },

  create: async (data: LoanCreateInput): Promise<Loan> => {
    const response = await apiClient.post<ApiResponse<Loan>>("/api/management/loans", data)
    return response.data.data!
  },

  returnLoan: async (id: number): Promise<Loan> => {
    const response = await apiClient.post<ApiResponse<Loan>>(`/api/management/loans/${id}/return`, {})
    return response.data.data!
  },

  reportLost: async (id: number): Promise<Loan> => {
    const response = await apiClient.post<ApiResponse<Loan>>(`/api/management/loans/${id}/report-lost`, {})
    return response.data.data!
  },

  reportDamaged: async ({ id, data }: { id: number; data: LoanReportDamagedInput }): Promise<Loan> => {
    const response = await apiClient.post<ApiResponse<Loan>>(`/api/management/loans/${id}/report-damaged`, data)
    return response.data.data!
  },
}
