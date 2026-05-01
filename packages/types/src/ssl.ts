import type { UUID, ISO8601, BaseEntity } from './common';

export interface SslCertificate extends BaseEntity {
  domainId: UUID;
  domainName: string;
  type: SslType;
  issuer: string;
  subject: Record<string, string>;
  serialNumber: string;
  fingerprint: string;
  validFrom: ISO8601;
  validTo: ISO8601;
  daysRemaining: number;
  autoRenew: boolean;
  renewalStatus: RenewalStatus;
  lastRenewalAt?: ISO8601 | null;
  lastRenewalError?: string | null;
  certPath: string;
  keyPath: string;
  chainPath?: string | null;
  fullchainPath: string;
  challengeType: ChallengeType;
  wildcard: boolean;
  sans: string[];
  revoked: boolean;
  hstsConfigured: boolean;
  ocspStapling: boolean;
  tlsMinVersion: string;
}

export type SslType = 'letsencrypt' | 'custom' | 'self_signed';
export type RenewalStatus = 'active' | 'pending' | 'failed' | 'not_configured';
export type ChallengeType = 'http' | 'dns';

export interface IssueCertificateInput {
  domainId: UUID;
  type?: SslType;
  challengeType?: ChallengeType;
  wildcard?: boolean;
  sans?: string[];
  autoRenew?: boolean;
}

export interface UploadCertificateInput {
  domainId: UUID;
  certificate: string;
  privateKey: string;
  chain?: string;
}

export interface SslCheckResult {
  valid: boolean;
  daysRemaining: number;
  issuer: string;
  errors: string[];
  warnings: string[];
}

export interface HstsConfig {
  enabled: boolean;
  maxAge: number;
  includeSubDomains: boolean;
  preload: boolean;
}