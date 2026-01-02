import { useMutation, useQueryClient, queryOptions } from "@tanstack/react-query"
import { FineSearchParams } from "../types/fine"
import { FINE_QUERY_KEYS } from "./query-keys"
import { fineService } from "../services/fineService"

export const fineQueries = {
  list: (params: FineSearchParams) =>
    queryOptions({
      queryKey: FINE_QUERY_KEYS.list(params),
      queryFn: () => {
        const page = (params.page || 1) - 1
        return fineService.getAll({ ...params, page: Math.max(0, page) })
      },
      placeholderData: (previousData) => previousData,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: FINE_QUERY_KEYS.detail(id),
      queryFn: () => fineService.getById(id),
    }),
}

export const useCreateFine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: fineService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: FINE_QUERY_KEYS.lists() })
    },
  })
}

export const usePayFine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: fineService.pay,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: FINE_QUERY_KEYS.lists() })
      await queryClient.invalidateQueries({ queryKey: FINE_QUERY_KEYS.detail(data.id) })
    },
  })
}

export const useWaiveFine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: fineService.waive,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: FINE_QUERY_KEYS.lists() })
      await queryClient.invalidateQueries({ queryKey: FINE_QUERY_KEYS.detail(data.id) })
    },
  })
}
