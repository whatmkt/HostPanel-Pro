import type { UUID, ISO8601 } from './common';

export interface SystemMetric {
  id: string;
  serverId: UUID;
  timestamp: ISO8601;
  cpuPercent: number;
  ramPercent: number;
  ramUsedMb: number;
  ramTotalMb: number;
  diskPercent: number;
  diskUsedMb: number;
  diskTotalMb: number;
  loadAvg1: number;
  loadAvg5: number;
  loadAvg15: number;
  networkRxBytes: number;
  networkTxBytes: number;
  uptimeSeconds: number;
  processCount: number;
  swapUsedMb: number;
  swapTotalMb: number;
}

export interface MonitoredService {
  id: string;
  serverId: UUID;
  serviceName: string;
  status: 'running' | 'stopped' | 'failed' | 'unknown';
  memoryMb: number;
  cpuPercent: number;
  pid?: number | null;
  lastChecked: ISO8601;
  uptimeSeconds: number;
}

export interface MonitoringAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  resourceId?: UUID | null;
  resourceType?: string | null;
  value?: number | null;
  threshold?: number | null;
  createdAt: ISO8601;
  acknowledgedAt?: ISO8601 | null;
  acknowledgedBy?: UUID | null;
  resolvedAt?: ISO8601 | null;
}

export type AlertType =
  | 'cpu_high'
  | 'ram_high'
  | 'disk_full'
  | 'service_down'
  | 'ssl_expiring'
  | 'backup_failed'
  | 'malware_detected'
  | 'mail_queue_high'
  | 'http_errors'
  | 'brute_force'
  | 'domain_suspended'
  | 'update_available';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface AlertConfig {
  alertType: AlertType;
  enabled: boolean;
  threshold?: number;
  channels: AlertChannel[];
}

export type AlertChannel = 'email' | 'webhook' | 'telegram' | 'slack';

export interface CreateAlertConfigInput {
  alertType: AlertType;
  enabled: boolean;
  threshold?: number;
  channels: AlertChannel[];
  emailRecipients?: string[];
  webhookUrl?: string;
}

export interface DashboardSummary {
  server: {
    cpuPercent: number;
    ramPercent: number;
    diskPercent: number;
    loadAvg: number;
    uptimeSeconds: number;
  };
  services: {
    total: number;
    running: number;
    stopped: number;
    failed: number;
  };
  counts: {
    domains: number;
    databases: number;
    mailboxes: number;
    backups: number;
    users: number;
  };
  sslExpiring: number;
  activeAlerts: number;
  recentBackups: number;
  updateAvailable: boolean;
  queueJobs: number;
}