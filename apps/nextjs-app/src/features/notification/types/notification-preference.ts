export enum NotificationCategory {
  LOAN_OVERDUE = "LOAN_OVERDUE",
  LOAN_DUE_SOON = "LOAN_DUE_SOON",
  FINE_ISSUED = "FINE_ISSUED",
  FINE_PAID = "FINE_PAID",
  GENERAL_ANNOUNCEMENT = "GENERAL_ANNOUNCEMENT"
}

export enum NotificationChannel {
  EMAIL = "EMAIL",
  SMS = "SMS",
  PUSH_NOTIFICATION = "PUSH_NOTIFICATION"
}

export type UserNotificationPreference = {
  category: NotificationCategory;
  channels: NotificationChannel[];
}
