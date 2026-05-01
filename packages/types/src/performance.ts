import type { UUID, BaseEntity } from './common';

export interface PerformanceProfile extends BaseEntity {
  name: string;
  mode: OptimizationMode;
  serverId?: UUID | null;
  isActive: boolean;
  isGlobal: boolean;
  settings: PerformanceSettings;
  lastAppliedAt?: string | null;
  history: PerformanceChange[];
}

export type OptimizationMode = 'safe' | 'wordpress' | 'woocommerce' | 'maximum' | 'custom';

export interface PerformanceSettings {
  cache: {
    staticEnabled: boolean;
    fastcgiEnabled: boolean;
    microcacheEnabled: boolean;
    browserCacheEnabled: boolean;
    cacheDuration: number;
    excludedUrls: string[];
    excludedCookies: string[];
    bypassLoggedIn: boolean;
    bypassWooCommerce: boolean;
    purgeOnUpdate: boolean;
  };
  compression: {
    gzipEnabled: boolean;
    brotliEnabled: boolean;
    gzipLevel: number;
    brotliLevel: number;
  };
  php: {
    memoryLimit: string;
    maxExecutionTime: number;
    opcacheEnabled: boolean;
    opcacheMemoryConsumption: number;
  };
  nginx: {
    workerConnections: number;
    keepaliveTimeout: number;
    http2Enabled: boolean;
    http3Enabled: boolean;
    rateLimitEnabled: boolean;
  };
  database: {
    queryCacheEnabled: boolean;
    innodbBufferPoolSize: string;
    slowQueryLog: boolean;
  };
}

export interface PerformanceChange {
  timestamp: string;
  field: string;
  oldValue: string;
  newValue: string;
  appliedBy: UUID;
}

export interface CacheRule extends BaseEntity {
  domainId?: UUID | null;
  pattern: string;
  type: 'exclude_url' | 'exclude_cookie' | 'exclude_query' | 'custom_header';
  value: string;
  isActive: boolean;
}

export interface WebOptimizationSetting extends BaseEntity {
  domainId: UUID;
  option: string;
  value: string;
  description?: string | null;
}

export interface PerformanceRecommendation {
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action: string;
  reversible: boolean;
  appliedAt?: string;
}

export interface CreateCacheRuleInput {
  domainId?: UUID;
  pattern: string;
  type: 'exclude_url' | 'exclude_cookie' | 'exclude_query' | 'custom_header';
  value: string;
}