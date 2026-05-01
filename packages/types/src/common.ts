// =============================================================================
// Common Shared Types
// =============================================================================

export type UUID = string;

export type ISO8601 = string;

export type Email = string;

export type PhoneNumber = string;

export type IPAddress = string;

export type Port = number;

export type Percentage = number;

export type Bytes = number;

export type Megabytes = number;

export type Gigabytes = number;

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface DateRange {
  start: ISO8601;
  end: ISO8601;
}

export type ServiceStatus = 'running' | 'stopped' | 'restarting' | 'failed' | 'unknown';

export type ActionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'rolled_back';

export type SeverityLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';

export type TlsVersion = '1.0' | '1.1' | '1.2' | '1.3';

export type HttpProtocol = 'http/1.1' | 'http/2' | 'http/3';

export type ServerOs = 'ubuntu_24_04' | 'debian_12' | 'almalinux_9' | 'rocky_linux_9';

export type WebServer = 'nginx' | 'apache' | 'nginx_apache';

export type PhpHandler = 'fpm' | 'fpm_apache';

export interface TimestampFields {
  createdAt: ISO8601;
  updatedAt: ISO8601;
  deletedAt?: ISO8601 | null;
}

export interface AuditFields {
  createdBy?: UUID | null;
  updatedBy?: UUID | null;
}

export interface BaseEntity extends TimestampFields, AuditFields {
  id: UUID;
}

export type SortDirection = 'asc' | 'desc';

export interface DateFilter {
  gte?: ISO8601;
  lte?: ISO8601;
  gt?: ISO8601;
  lt?: ISO8601;
}

export interface SearchParams extends PaginationParams {
  search?: string;
  filters?: Record<string, unknown>;
}