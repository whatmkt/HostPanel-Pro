import type { UUID, BaseEntity, HttpProtocol } from './common';

export interface Website extends BaseEntity {
  domainId: UUID;
  documentRoot: string;
  accessLogPath: string;
  errorLogPath: string;
  phpPoolName?: string | null;
  nginxConfigPath: string;
  apacheConfigPath?: string | null;
  indexFiles: string[];
  directoryListing: boolean;
  passwordProtected: boolean;
  passwordFile?: string | null;
  hotlinkProtection: boolean;
  securityHeaders: SecurityHeaders;
  customNginxRules?: string | null;
  customApacheRules?: string | null;
  compressStatic: boolean;
  browserCacheEnabled: boolean;
  cacheControlRules?: string | null;
  rateLimitEnabled: boolean;
  rateLimitRequests: number;
  rateLimitPeriod: number;
  errorPages: Record<string, string>;
  openBasedirRestriction: string;
  disableFunctions: string[];
  phpAdminValues: Record<string, string>;
}

export interface Subdomain extends BaseEntity {
  domainId: UUID;
  subdomain: string;
  fullDomain: string;
  documentRoot: string;
  status: 'active' | 'suspended';
}

export interface DomainAlias extends BaseEntity {
  domainId: UUID;
  alias: string;
  status: 'active' | 'suspended';
  redirectToPrimary: boolean;
}

export interface SecurityHeaders {
  xFrameOptions: string;
  xContentTypeOptions: string;
  xXssProtection: string;
  referrerPolicy: string;
  permissionsPolicy: string;
  contentSecurityPolicy?: string | null;
}

export interface PhpPoolSettings {
  memoryLimit: string;
  maxExecutionTime: number;
  maxInputTime: number;
  postMaxSize: string;
  uploadMaxFilesize: string;
  maxFileUploads: number;
  opcacheEnabled: boolean;
  opcacheMemoryConsumption: number;
  opcacheMaxAcceleratedFiles: number;
  opcacheValidateTimestamps: boolean;
  realpathCacheSize: string;
  realpathCacheTtl: number;
}

export interface CreateSubdomainInput {
  domainId: UUID;
  subdomain: string;
  documentRoot?: string;
}

export interface CreateDomainAliasInput {
  domainId: UUID;
  alias: string;
  redirectToPrimary?: boolean;
}

export interface UpdateWebsiteInput {
  documentRoot?: string;
  directoryListing?: boolean;
  hotlinkProtection?: boolean;
  securityHeaders?: Partial<SecurityHeaders>;
  customNginxRules?: string;
  compressStatic?: boolean;
  browserCacheEnabled?: boolean;
  cacheControlRules?: string;
  rateLimitEnabled?: boolean;
  rateLimitRequests?: number;
  rateLimitPeriod?: number;
  errorPages?: Record<string, string>;
  openBasedirRestriction?: string;
  disableFunctions?: string[];
  phpAdminValues?: Record<string, string>;
  passwordProtected?: boolean;
}