import { useMutation, useQueryClient, queryOptions } from "@tanstack/react-query"
import { CopySearchParams } from "../types/copy"
import { COPY_QUERY_KEYS } from "./query-keys"
import { copyService } from "../services/copyService"

export const copyQueries = {
  list: (params: CopySearchParams) =>
    queryOptions({
      queryKey: COPY_QUERY_KEYS.list(params),
      queryFn: () => {
        const page = (params.page || 1) - 1
        return copyService.getAll({ ...params, page: Math.max(0, page) })
      },
      placeholderData: (previousData) => previousData,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: COPY_QUERY_KEYS.detail(id),
      queryFn: () => copyService.getById(id),
    }),
}

export const useCreateCopy = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: copyService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: COPY_QUERY_KEYS.lists() })
    },
  })
}

export const useUpdateCopy = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: copyService.update,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: COPY_QUERY_KEYS.lists() })
      await queryClient.invalidateQueries({ queryKey: COPY_QUERY_KEYS.detail(data.id) })
    },
  })
}

export const useRetireCopy = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: copyService.retire,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: COPY_QUERY_KEYS.lists() })
    },
  })
}
