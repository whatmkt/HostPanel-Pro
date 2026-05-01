import type { UUID, ISO8601, BaseEntity } from './common';

export interface Subscription extends BaseEntity {
  clientId: UUID;
  planId: UUID;
  serverId?: UUID | null;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  startDate: ISO8601;
  endDate?: ISO8601 | null;
  nextBillingDate?: ISO8601 | null;
  trialEndDate?: ISO8601 | null;
  autoRenew: boolean;
  notes?: string | null;
  customLimits?: Partial<PlanLimits>;
  client?: { id: UUID; name: string; email: string };
  plan?: { id: UUID; name: string; slug: string };
}

export type SubscriptionStatus = 'active' | 'suspended' | 'cancelled' | 'pending' | 'trial' | 'expired';
export type BillingCycle = 'monthly' | 'yearly' | 'lifetime';

export interface PlanLimits {
  diskSpaceMb: number;
  bandwidthMb: number;
  maxDomains: number;
  maxMailboxes: number;
  maxDatabases: number;
  maxFtpAccounts: number;
  maxBackups: number;
}

export interface CreateSubscriptionInput {
  clientId: UUID;
  planId: UUID;
  serverId?: UUID;
  billingCycle: BillingCycle;
  startDate: ISO8601;
  trialEndDate?: ISO8601;
  autoRenew?: boolean;
  notes?: string;
  customLimits?: Partial<PlanLimits>;
}

export interface UpdateSubscriptionInput {
  status?: SubscriptionStatus;
  billingCycle?: BillingCycle;
  autoRenew?: boolean;
  notes?: string;
  customLimits?: Partial<PlanLimits>;
}