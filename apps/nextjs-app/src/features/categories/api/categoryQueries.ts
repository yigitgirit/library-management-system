import { useMutation, useQueryClient, queryOptions } from "@tanstack/react-query"
import { CategorySearchParams } from "../types/category"
import { CATEGORY_QUERY_KEYS } from "./query-keys"
import { categoryService } from "../services/categoryService"

export const categoryQueries = {
  list: (params: CategorySearchParams) =>
    queryOptions({
      queryKey: CATEGORY_QUERY_KEYS.list(params),
      queryFn: () => {
        const page = (params.page || 1) - 1
        return categoryService.getAll({ ...params, page: Math.max(0, page) })
      },
      placeholderData: (previousData) => previousData,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: CATEGORY_QUERY_KEYS.detail(id),
      queryFn: () => categoryService.getById(id),
    }),
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: categoryService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.lists() })
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: categoryService.update,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.lists() })
      await queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.detail(data.id) })
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: categoryService.delete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.lists() })
    },
  })
}
