import { useMutation, useQueryClient, queryOptions } from "@tanstack/react-query"
import { BookSearchParams } from "../types/book"
import { BOOK_QUERY_KEYS } from "./query-keys"
import { bookService } from "../services/bookService"

export const bookQueries = {
  list: (params: BookSearchParams) =>
    queryOptions({
      queryKey: BOOK_QUERY_KEYS.list(params),
      queryFn: () => {
        const page = (params.page || 1) - 1
        return bookService.getAll({ ...params, page: Math.max(0, page) })
      },
      placeholderData: (previousData) => previousData,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: BOOK_QUERY_KEYS.detail(id),
      queryFn: () => bookService.getById(id),
    }),
}

export const useCreateBook = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: bookService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: BOOK_QUERY_KEYS.lists() })
    },
  })
}

export const useUpdateBook = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: bookService.update,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: BOOK_QUERY_KEYS.lists() })
      await queryClient.invalidateQueries({ queryKey: BOOK_QUERY_KEYS.detail(data.id) })
    },
  })
}

export const useDeleteBook = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: bookService.delete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: BOOK_QUERY_KEYS.lists() })
    },
  })
}
