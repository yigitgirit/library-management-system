import { apiClient } from "@/lib/api-client"
import { UserNotificationPreference } from "../types/notification-preference"
import { UpdateNotificationPreferenceInput } from "../schemas/notification-preference"

export const notificationPreferenceService = {
  getAll: async (): Promise<UserNotificationPreference[]> => {
    const response = await apiClient.get<{ data: UserNotificationPreference[] }>("/api/notification-preferences")
    return response.data.data
  },

  update: async (data: UpdateNotificationPreferenceInput): Promise<UserNotificationPreference> => {
    const response = await apiClient.put<{ data: UserNotificationPreference }>("/api/notification-preferences", data)
    return response.data.data
  },
}
