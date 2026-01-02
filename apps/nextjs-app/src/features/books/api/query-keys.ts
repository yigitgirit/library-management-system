import { BookSearchParams } from "../types/book"

export const BOOK_QUERY_KEYS = {
  all: ["books"],
  lists: () => [...BOOK_QUERY_KEYS.all, "list"],
  list: (params: BookSearchParams) => [...BOOK_QUERY_KEYS.lists(), params],
  details: () => [...BOOK_QUERY_KEYS.all, "detail"],
  detail: (id: number) => [...BOOK_QUERY_KEYS.details(), id],
} as const