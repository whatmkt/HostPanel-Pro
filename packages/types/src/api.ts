import type { UUID } from './common';

// =============================================================================
// API Response Types
// =============================================================================

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponseEnvelope<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiErrorDetail[];
}

export interface PaginatedResponseEnvelope<T = unknown> extends ApiResponseEnvelope<T[]> {
  meta: PaginationMeta;
}

export interface ApiErrorDetail {
  code: string;
  field?: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  version: string;
  uptime: number;
  services: ServiceHealth[];
}

export interface ServiceHealth {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  latency?: number;
  error?: string;
}

// =============================================================================
// Query / Filter Params
// =============================================================================

export interface QueryPaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface QuerySearchParams extends QueryPaginationParams {
  search?: string;
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

// =============================================================================
// Bulk Operations
// =============================================================================

export interface BulkActionInput {
  ids: UUID[];
  action: string;
  params?: Record<string, unknown>;
}

export interface BulkActionResult {
  success: boolean;
  succeeded: UUID[];
  failed: Array<{ id: UUID; error: string }>;
}

// =============================================================================
// Dashboard
// =============================================================================

export interface DashboardResponse {
  server: {
    hostname: string;
    cpuPercent: number;
    cpuCores: number;
    ramPercent: number;
    ramUsedMb: number;
    ramTotalMb: number;
    diskPercent: number;
    diskUsedMb: number;
    diskTotalMb: number;
    loadAvg: number;
    uptimeSeconds: number;
    status: 'online' | 'offline' | 'maintenance';
  };
  services: {
    total: number;
    running: number;
    stopped: number;
    failed: number;
    details: Array<{
      name: string;
      status: string;
      pid?: number;
      memoryMb?: number;
    }>;
  };
  counts: {
    domains: number;
    subdomains: number;
    databases: number;
    mailboxes: number;
    ftpAccounts: number;
    backups: number;
    users: number;
    clients: number;
  };
  ssl: {
    active: number;
    expiringSoon: number;
    expired: number;
  };
  alerts: {
    active: number;
    critical: number;
    warning: number;
  };
  backups: {
    total: number;
    lastRunAt?: string;
    lastStatus?: string;
    failed: number;
  };
  updates: {
    panelVersion: string;
    availableUpdate: boolean;
    latestVersion?: string;
    systemPackages: number;
    securityUpdates: number;
  };
  queue: {
    pending: number;
    active: number;
    failed: number;
  };
  network: {
    rxBytes: number;
    txBytes: number;
    activeConnections: number;
    requestsPerMin: number;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    description: string;
    timestamp: string;
    severity: 'info' | 'warning' | 'error';
  }>;
  topDomains: Array<{
    domain: string;
    requests: number;
    bandwidthMb: number;
    errors: number;
  }>;
  recommendations: Array<{
    category: string;
    title: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

// =============================================================================
// Menu definitions
// =============================================================================

export interface MenuSection {
  id: string;
  label: string;
  icon: string;
  items: MenuItem[];
  order: number;
  requiredPermission?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  badge?: string;
  badgeVariant?: 'default' | 'warning' | 'error' | 'success';
  items?: MenuItem[];
  requiredPermission?: string;
  order: number;
}

// =============================================================================
// Notification types for frontend
// =============================================================================

export interface AppNotification {
  id: string;
  type: AppNotificationType;
  severity: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export type AppNotificationType =
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

export interface UnreadCount {
  total: number;
  critical: number;
  warning: number;
}
