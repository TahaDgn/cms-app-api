export enum NotificationType {
  REGISTRATION_LINK = 'REGISTRATION_LINK',
  LOGIN_LINK = 'LOGIN_LINK',
  USER_DELETED = 'USER_DELETED',
  OTHER = 'OTHER',
}

export interface AccessUrlContext {
  accessUrl: string;
}

export interface NotificationMessage {
  type: NotificationType;
  email: string;
  payload: any;
}
