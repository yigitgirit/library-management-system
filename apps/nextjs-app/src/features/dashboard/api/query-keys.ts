export const DASHBOARD_QUERY_KEYS = {
  all: ["dashboard"],
  overview: () => [...DASHBOARD_QUERY_KEYS.all, "overview"],
} as const
