import { useMutation, useQueryClient, queryOptions } from "@tanstack/react-query"
import { NOTIFICATION_PREFERENCE_QUERY_KEYS } from "./query-keys"
import { notificationPreferenceService } from "../services/notificationPreferenceService"

export const notificationPreferenceQueries = {
  list: () =>
    queryOptions({
      queryKey: NOTIFICATION_PREFERENCE_QUERY_KEYS.lists(),
      queryFn: () => notificationPreferenceService.getAll(),
    }),
}

export const useUpdateNotificationPreference = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationPreferenceService.update,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: NOTIFICATION_PREFERENCE_QUERY_KEYS.lists() })
    },
  })
}
