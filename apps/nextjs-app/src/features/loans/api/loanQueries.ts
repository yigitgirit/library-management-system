import { useMutation, useQueryClient, queryOptions } from "@tanstack/react-query"
import { LoanSearchParams } from "../types/loan"
import { LOAN_QUERY_KEYS } from "./query-keys"
import { loanService } from "../services/loanService"

export const loanQueries = {
  list: (params: LoanSearchParams) =>
    queryOptions({
      queryKey: LOAN_QUERY_KEYS.list(params),
      queryFn: () => {
        const page = (params.page || 1) - 1
        return loanService.getAll({ ...params, page: Math.max(0, page) })
      },
      placeholderData: (previousData) => previousData,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: LOAN_QUERY_KEYS.detail(id),
      queryFn: () => loanService.getById(id),
    }),

  myLoans: () =>
    queryOptions({
      queryKey: LOAN_QUERY_KEYS.myLoans(),
      queryFn: () => loanService.getMyLoans(),
    }),
}

export const useCreateLoan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: loanService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: LOAN_QUERY_KEYS.lists() })
    },
  })
}

export const useReturnLoan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: loanService.returnLoan,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: LOAN_QUERY_KEYS.lists() })
      await queryClient.invalidateQueries({ queryKey: LOAN_QUERY_KEYS.detail(data.id) })
      await queryClient.invalidateQueries({ queryKey: LOAN_QUERY_KEYS.myLoans() })
    },
  })
}

export const useReportLostLoan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: loanService.reportLost,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: LOAN_QUERY_KEYS.lists() })
      await queryClient.invalidateQueries({ queryKey: LOAN_QUERY_KEYS.detail(data.id) })
      await queryClient.invalidateQueries({ queryKey: LOAN_QUERY_KEYS.myLoans() })
    },
  })
}

export const useReportDamagedLoan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: loanService.reportDamaged,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: LOAN_QUERY_KEYS.lists() })
      await queryClient.invalidateQueries({ queryKey: LOAN_QUERY_KEYS.detail(data.id) })
      await queryClient.invalidateQueries({ queryKey: LOAN_QUERY_KEYS.myLoans() })
    },
  })
}
