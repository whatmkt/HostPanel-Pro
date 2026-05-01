import type { UUID, ISO8601, BaseEntity } from './common';

export interface FirewallRule extends BaseEntity {
  name: string;
  type: 'allow' | 'deny';
  protocol: 'tcp' | 'udp' | 'icmp' | 'all';
  port?: number | null;
  portRange?: string | null;
  source?: string | null;
  destination?: string | null;
  comment?: string | null;
  isActive: boolean;
  order: number;
}

export interface Fail2BanJail extends BaseEntity {
  service: string;
  jailName: string;
  enabled: boolean;
  maxRetry: number;
  findTime: number;
  banTime: number;
  port?: string | null;
  filter?: string | null;
  logPath?: string | null;
  banCount: number;
  lastBanAt?: ISO8601 | null;
}

export interface Fail2BanBan extends BaseEntity {
  jailId: UUID;
  ip: string;
  bannedAt: ISO8601;
  unbanAt: ISO8601;
  attempts: number;
  active: boolean;
}

export interface MalwareScan extends BaseEntity {
  type: 'quick' | 'full' | 'domain' | 'client';
  targetId?: UUID | null;
  status: 'pending' | 'running' | 'completed' | 'failed';
  filesScanned: number;
  threatsFound: number;
  startedAt?: ISO8601 | null;
  completedAt?: ISO8601 | null;
  error?: string | null;
}

export interface MalwareFinding extends BaseEntity {
  scanId: UUID;
  filePath: string;
  threatName: string;
  status: 'quarantined' | 'deleted' | 'restored' | 'pending_review';
  quarantinedAt?: ISO8601 | null;
  resolvedAt?: ISO8601 | null;
  falsePositive: boolean;
}

export interface CreateFirewallRuleInput {
  name: string;
  type: 'allow' | 'deny';
  protocol: 'tcp' | 'udp' | 'icmp' | 'all';
  port?: number;
  portRange?: string;
  source?: string;
  comment?: string;
}

export interface UpdateJailInput {
  enabled?: boolean;
  maxRetry?: number;
  findTime?: number;
  banTime?: number;
}

export interface SecurityCenterStatus {
  overallScore: number;
  firewallActive: boolean;
  fail2banActive: boolean;
  antivirusActive: boolean;
  lastMalwareScan?: ISO8601;
  openPorts: number;
  securityHeadersOk: number;
  recommendations: SecurityRecommendation[];
}

export interface SecurityRecommendation {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  title: string;
  description: string;
  action: string;
  resolved: boolean;
}