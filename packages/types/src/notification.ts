import type { UUID, ISO8601, BaseEntity } from './common';

export interface Notification extends BaseEntity {
  userId?: UUID | null;
  clientId?: UUID | null;
  type: NotificationType;
  severity: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  link?: string | null;
  read: boolean;
  readAt?: ISO8601 | null;
  metadata?: Record<string, string> | null;
}

export type NotificationType =
  | 'ssl_expiring'
  | 'backup_completed'
  | 'backup_failed'
  | 'disk_warning'
  | 'service_down'
  | 'security_alert'
  | 'malware_detect'
  | 'update_available'
  | 'domain_suspended'
  | 'subscription_expire'
  | 'quota_exceeded'
  | 'system_alert';