import type { UUID, ISO8601, BaseEntity, WebServer, HttpProtocol } from './common';

export interface Domain extends BaseEntity {
  domainName: string;
  documentRoot: string;
  subscriptionId?: UUID | null;
  clientId?: UUID | null;
  serverId?: UUID | null;
  status: DomainStatus;
  webServer: WebServer;
  phpVersion?: string | null;
  phpHandler: 'fpm' | 'fpm_apache';
  ipAddress: string;
  port: number;
  sslEnabled: boolean;
  forceHttps: boolean;
  wwwRedirect: WwwRedirect;
  httpProtocol: HttpProtocol;
  brotliEnabled: boolean;
  gzipEnabled: boolean;
  hstsEnabled: boolean;
  suspended: boolean;
  suspendedReason?: string | null;
  diskUsageBytes: number;
  bandwidthUsedMb: number;
  lastErrorAt?: ISO8601 | null;
  subscription?: { id: UUID; planId: UUID; clientId: UUID };
}

export type DomainStatus = 'active' | 'pending' | 'suspended' | 'error' | 'deleting';
export type WwwRedirect = 'none' | 'to_www' | 'to_non_www';

export interface CreateDomainInput {
  domainName: string;
  subscriptionId?: UUID;
  clientId?: UUID;
  webServer?: WebServer;
  phpVersion?: string;
  ipAddress?: string;
  port?: number;
  forceHttps?: boolean;
  wwwRedirect?: WwwRedirect;
}

export interface UpdateDomainInput {
  documentRoot?: string;
  webServer?: WebServer;
  phpVersion?: string;
  sslEnabled?: boolean;
  forceHttps?: boolean;
  wwwRedirect?: WwwRedirect;
  brotliEnabled?: boolean;
  gzipEnabled?: boolean;
  hstsEnabled?: boolean;
  suspended?: boolean;
  suspendedReason?: string;
}