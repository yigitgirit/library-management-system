import { ReviewSearchParams } from "../types/review"

export const REVIEW_QUERY_KEYS = {
  all: ["reviews"],
  lists: () => [...REVIEW_QUERY_KEYS.all, "list"],
  list: (params: ReviewSearchParams) => [...REVIEW_QUERY_KEYS.lists(), params],
  details: () => [...REVIEW_QUERY_KEYS.all, "detail"],
  detail: (id: number) => [...REVIEW_QUERY_KEYS.details(), id],
  byBook: (bookId: number) => [...REVIEW_QUERY_KEYS.all, "book", bookId],
  myReviews: () => [...REVIEW_QUERY_KEYS.all, "my-reviews"],
} as const

