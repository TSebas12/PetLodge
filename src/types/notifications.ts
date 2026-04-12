export type NotificationType =
  | "user_registered"
  | "reservation_created"
  | "reservation_confirmed"
  | "reservation_updated"
  | "reservation_cancelled"
  | "checkin_started"
  | "checkout_completed"
  | "pet_status"
  | "general";

export interface NotificationChannels {
  inApp: boolean;
  email: boolean;
}

export interface NotificationEmailStatus {
  attempted: boolean;
  sent: boolean;
  recipient?: string | null;
  provider?: string | null;
  providerMessageId?: string | null;
  errorMessage?: string | null;
}

export interface AppNotification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  channels: NotificationChannels;
  isRead: boolean;
  readAt?: string | null;
  sentAt?: string | null;
  relatedPetId?: string | null;
  relatedPetName?: string | null;
  relatedPetImage?: string | null;
  relatedReservationId?: string | null;
  createdAt: string;
  updatedAt?: string;
  emailStatus?: NotificationEmailStatus;
  metadata?: Record<string, unknown>;
}
