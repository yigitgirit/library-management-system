export const FINE_QUERY_KEYS = {
  all: ["fines"],
  lists: () => [...FINE_QUERY_KEYS.all, "list"],
  list: (params: Record<string, any>) => [...FINE_QUERY_KEYS.lists(), params],
  details: () => [...FINE_QUERY_KEYS.all, "detail"],
  detail: (id: number) => [...FINE_QUERY_KEYS.details(), id],
} as const
