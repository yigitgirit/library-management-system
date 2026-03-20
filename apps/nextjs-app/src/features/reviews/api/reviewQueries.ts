import { useMutation, useQueryClient, queryOptions } from "@tanstack/react-query"
import { ReviewSearchParams } from "../types/review"
import { REVIEW_QUERY_KEYS } from "./query-keys"
import { reviewService } from "../services/reviewService"
import {BOOK_QUERY_KEYS} from "@/features/books/api/query-keys";

export const reviewQueries = {
  list: (params: ReviewSearchParams) =>
    queryOptions({
      queryKey: REVIEW_QUERY_KEYS.list(params),
      queryFn: () => {
        const page = (params.page || 1) - 1
        return reviewService.getAllReviews({ ...params, page: Math.max(0, page) + 1 })
      },
      placeholderData: (previousData) => previousData,
    }),

  byBook: (bookId: number, params?: Omit<ReviewSearchParams, "bookId">) =>
    queryOptions({
      queryKey: REVIEW_QUERY_KEYS.byBook(bookId),
      queryFn: () => reviewService.getReviewsByBook(bookId, params),
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: REVIEW_QUERY_KEYS.detail(id),
      queryFn: () => reviewService.getReviewById(id),
    }),

  myReviews: (params?: Omit<ReviewSearchParams, "userId">) =>
    queryOptions({
      queryKey: REVIEW_QUERY_KEYS.myReviews(),
      queryFn: () => reviewService.getMyReviews(params),
    }),

  myReviewForBook: (bookId: number) =>
    queryOptions({
      queryKey: [...REVIEW_QUERY_KEYS.byBook(bookId), "me"],
      queryFn: () => reviewService.getMyReviewForBook(bookId),
    }),
}

export const useCreateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: REVIEW_QUERY_KEYS.byBook(data.bookId),
      })
      await queryClient.invalidateQueries({
        queryKey: REVIEW_QUERY_KEYS.myReviews(),
      })
      await queryClient.invalidateQueries({
        queryKey: [...REVIEW_QUERY_KEYS.byBook(data.bookId), "me"],
      })
      await queryClient.invalidateQueries({
        queryKey: BOOK_QUERY_KEYS.detail(data.bookId),
      })
    },
  })
}

export const useUpdateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reviewService.updateReview,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: REVIEW_QUERY_KEYS.detail(data.id),
      })
      await queryClient.invalidateQueries({
        queryKey: REVIEW_QUERY_KEYS.byBook(data.bookId),
      })
      await queryClient.invalidateQueries({
        queryKey: REVIEW_QUERY_KEYS.myReviews(),
      })
      await queryClient.invalidateQueries({
        queryKey: [...REVIEW_QUERY_KEYS.byBook(data.bookId), "me"],
      })
      await queryClient.invalidateQueries({
        queryKey: BOOK_QUERY_KEYS.detail(data.bookId),
      })
    },
  })
}

export const useDeleteReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number; bookId: number }) => reviewService.deleteReview(id),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: REVIEW_QUERY_KEYS.lists(),
      })
      await queryClient.invalidateQueries({
        queryKey: REVIEW_QUERY_KEYS.myReviews(),
      })
      await queryClient.invalidateQueries({
        queryKey: REVIEW_QUERY_KEYS.byBook(variables.bookId),
      })
      await queryClient.invalidateQueries({
        queryKey: [...REVIEW_QUERY_KEYS.byBook(variables.bookId), "me"],
      })
      await queryClient.invalidateQueries({
        queryKey: BOOK_QUERY_KEYS.detail(variables.bookId),
      })
    },
  })
}

export const useDeleteReviewAsAdmin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number; bookId: number }) => reviewService.deleteReviewAsAdmin(id),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: REVIEW_QUERY_KEYS.lists(),
      })
      await queryClient.invalidateQueries({
        queryKey: REVIEW_QUERY_KEYS.byBook(variables.bookId),
      })
      await queryClient.invalidateQueries({
        queryKey: [...REVIEW_QUERY_KEYS.byBook(variables.bookId), "me"],
      })
      await queryClient.invalidateQueries({
        queryKey: BOOK_QUERY_KEYS.detail(variables.bookId),
      })
    },
  })
}
