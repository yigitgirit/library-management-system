export const COPY_QUERY_KEYS = {
  all: ["copies"],
  lists: () => [...COPY_QUERY_KEYS.all, "list"],
  list: (params: Record<string, any>) => [...COPY_QUERY_KEYS.lists(), params],
  details: () => [...COPY_QUERY_KEYS.all, "detail"],
  detail: (id: number) => [...COPY_QUERY_KEYS.details(), id],
} as const
