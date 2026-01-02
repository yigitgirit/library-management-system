export const LOAN_QUERY_KEYS = {
  all: ["loans"],
  lists: () => [...LOAN_QUERY_KEYS.all, "list"],
  list: (params: Record<string, any>) => [...LOAN_QUERY_KEYS.lists(), params],
  details: () => [...LOAN_QUERY_KEYS.all, "detail"],
  detail: (id: number) => [...LOAN_QUERY_KEYS.details(), id],
  myLoans: () => [...LOAN_QUERY_KEYS.all, "my-loans"],
} as const
