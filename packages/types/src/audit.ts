import type { UUID, ISO8601 } from './common';

export type AuditAction =
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'password_change'
  | '2fa_enabled'
  | '2fa_disabled'
  | 'domain_create'
  | 'domain_delete'
  | 'domain_update'
  | 'domain_suspend'
  | 'dns_update'
  | 'ssl_issue'
  | 'ssl_renew'
  | 'ssl_delete'
  | 'firewall_rule_create'
  | 'firewall_rule_delete'
  | 'mailbox_create'
  | 'mailbox_delete'
  | 'database_create'
  | 'database_delete'
  | 'file_upload'
  | 'file_delete'
  | 'backup_create'
  | 'backup_restore'
  | 'malware_scan'
  | 'update_panel'
  | 'service_restart'
  | 'config_change'
  | 'agent_action'
  | 'user_create'
  | 'user_delete'
  | 'user_update'
  | 'client_create'
  | 'client_delete'
  | 'plan_create'
  | 'plan_delete'
  | 'subscription_create'
  | 'subscription_delete'
  | 'wordpress_install'
  | 'wordpress_update'
  | 'git_deploy'
  | 'docker_create'
  | 'docker_delete';

export interface AuditLog {
  id: string;
  userId?: UUID | null;
  username?: string | null;
  userEmail?: string | null;
  ipAddress: string;
  userAgent?: string | null;
  action: AuditAction;
  resourceType?: string | null;
  resourceId?: UUID | null;
  resourceName?: string | null;
  result: 'success' | 'failure';
  details?: Record<string, unknown> | null;
  beforeChange?: Record<string, unknown> | null;
  afterChange?: Record<string, unknown> | null;
  timestamp: ISO8601;
}

export interface AuditFilter {
  userId?: UUID;
  action?: AuditAction;
  resourceType?: string;
  resourceId?: UUID;
  result?: 'success' | 'failure';
  startDate?: ISO8601;
  endDate?: ISO8601;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AuditSummary {
  totalEvents: number;
  loginAttempts: number;
  failedLogins: number;
  criticalActions: number;
  last24Hours: number;
}