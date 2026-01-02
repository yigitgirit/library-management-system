import { useMutation, useQueryClient, queryOptions } from "@tanstack/react-query"
import { AuthorSearchParams } from "../types/author"
import { AUTHOR_QUERY_KEYS } from "./query-keys"
import { authorService } from "../services/authorService"

export const authorQueries = {
  list: (params: AuthorSearchParams) =>
    queryOptions({
      queryKey: AUTHOR_QUERY_KEYS.list(params),
      queryFn: () => {
        const page = (params.page || 1) - 1
        return authorService.getAll({ ...params, page: Math.max(0, page) })
      },
      placeholderData: (previousData) => previousData,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: AUTHOR_QUERY_KEYS.detail(id),
      queryFn: () => authorService.getById(id),
    }),
}

export const useCreateAuthor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authorService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTHOR_QUERY_KEYS.lists() })
    },
  })
}

export const useUpdateAuthor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authorService.update,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: AUTHOR_QUERY_KEYS.lists() })
      await queryClient.invalidateQueries({ queryKey: AUTHOR_QUERY_KEYS.detail(data.id) })
    },
  })
}

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authorService.delete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTHOR_QUERY_KEYS.lists() })
    },
  })
}
