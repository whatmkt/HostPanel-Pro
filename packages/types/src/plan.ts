import type { UUID, BaseEntity, Megabytes } from './common';

export interface HostingPlan extends BaseEntity {
  name: string;
  slug: string;
  description?: string | null;
  diskSpaceMb: Megabytes;
  bandwidthMb: Megabytes;
  maxDomains: number;
  maxSubdomains: number;
  maxAliases: number;
  maxMailboxes: number;
  maxDatabases: number;
  maxFtpAccounts: number;
  maxBackups: number;
  phpSupport: boolean;
  sslSupport: boolean;
  sshSupport: boolean;
  cronSupport: boolean;
  wordpressSupport: boolean;
  priceMonthly: number;
  priceYearly: number;
  setupFee: number;
  isActive: boolean;
  isDefault: boolean;
  features: Record<string, boolean>;
  subscriptionCount?: number;
}

export interface CreatePlanInput {
  name: string;
  slug: string;
  description?: string;
  diskSpaceMb: number;
  bandwidthMb: number;
  maxDomains: number;
  maxSubdomains: number;
  maxAliases: number;
  maxMailboxes: number;
  maxDatabases: number;
  maxFtpAccounts: number;
  maxBackups: number;
  phpSupport?: boolean;
  sslSupport?: boolean;
  sshSupport?: boolean;
  cronSupport?: boolean;
  wordpressSupport?: boolean;
  priceMonthly?: number;
  priceYearly?: number;
  setupFee?: number;
  features?: Record<string, boolean>;
}

export interface UpdatePlanInput extends Partial<CreatePlanInput> {
  isActive?: boolean;
  isDefault?: boolean;
}