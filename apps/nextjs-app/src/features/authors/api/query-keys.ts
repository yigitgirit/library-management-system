export const AUTHOR_QUERY_KEYS = {
  all: ["authors"],
  lists: () => [...AUTHOR_QUERY_KEYS.all, "list"],
  list: (params: Record<string, any>) => [...AUTHOR_QUERY_KEYS.lists(), params],
  details: () => [...AUTHOR_QUERY_KEYS.all, "detail"],
  detail: (id: number) => [...AUTHOR_QUERY_KEYS.details(), id],
} as const
