export const USER_QUERY_KEYS = {
  all: ["users"],
  lists: () => [...USER_QUERY_KEYS.all, "list"],
  list: (params: Record<string, any>) => [...USER_QUERY_KEYS.lists(), params],
  details: () => [...USER_QUERY_KEYS.all, "detail"],
  detail: (id: number) => [...USER_QUERY_KEYS.details(), id],
  profile: ["my-profile"],
  publicProfile: (id: number) => ["public-profile", id],
} as const
