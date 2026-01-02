import { z } from "zod"
import { NotificationCategory, NotificationChannel } from "../types/notification-preference"

export const updateNotificationPreferenceSchema = z.object({
  category: z.nativeEnum(NotificationCategory),
  channels: z.array(z.nativeEnum(NotificationChannel)),
})

export type UpdateNotificationPreferenceInput = z.infer<typeof updateNotificationPreferenceSchema>
