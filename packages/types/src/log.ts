import type { UUID, ISO8601 } from './common';

export interface LogEntry {
  id: string;
  serverId?: UUID | null;
  domainId?: UUID | null;
  service: LogService;
  level: LogLevel;
  message: string;
  timestamp: ISO8601;
  source?: string | null;
  metadata?: Record<string, string> | null;
}

export type LogService =
  | 'nginx_access'
  | 'nginx_error'
  | 'apache_access'
  | 'apache_error'
  | 'php_error'
  | 'php_fpm'
  | 'mariadb'
  | 'mysql'
  | 'postgresql'
  | 'postfix'
  | 'dovecot'
  | 'fail2ban'
  | 'clamav'
  | 'system'
  | 'panel'
  | 'backup'
  | 'ssl'
  | 'dns'
  | 'cron'
  | 'agent';

export type LogLevel = 'debug' | 'info' | 'notice' | 'warning' | 'error' | 'critical' | 'alert';

export interface LogFilter {
  service?: LogService;
  domainId?: UUID;
  level?: LogLevel;
  search?: string;
  startDate?: ISO8601;
  endDate?: ISO8601;
  page?: number;
  limit?: number;
}

export interface LogSummary {
  totalEntries: number;
  byService: Record<string, number>;
  byLevel: Record<string, number>;
  topErrors: Array<{ pattern: string; count: number }>;
}