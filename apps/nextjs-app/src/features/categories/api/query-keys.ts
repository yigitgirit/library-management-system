export const CATEGORY_QUERY_KEYS = {
  all: ["categories"],
  lists: () => [...CATEGORY_QUERY_KEYS.all, "list"],
  list: (params: Record<string, any>) => [...CATEGORY_QUERY_KEYS.lists(), params],
  details: () => [...CATEGORY_QUERY_KEYS.all, "detail"],
  detail: (id: number) => [...CATEGORY_QUERY_KEYS.details(), id],
} as const
