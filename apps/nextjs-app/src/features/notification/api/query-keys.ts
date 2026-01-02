export const NOTIFICATION_PREFERENCE_QUERY_KEYS = {
  all: ["notification-preferences"],
  lists: () => [...NOTIFICATION_PREFERENCE_QUERY_KEYS.all, "list"],
} as const
