import type { UUID, ISO8601, BaseEntity, Megabytes } from './common';

export interface BackupJob extends BaseEntity {
  name: string;
  type: BackupType;
  scope: BackupScope;
  scopeId?: UUID | null;
  destination: BackupDestination;
  schedule?: CronExpression | null;
  retentionDays: number;
  encrypt: boolean;
  compress: boolean;
  verifyIntegrity: boolean;
  includeFiles: boolean;
  includeDatabases: boolean;
  includeMail: boolean;
  includeDns: boolean;
  lastRunAt?: ISO8601 | null;
  lastRunStatus?: JobStatus | null;
  nextRunAt?: ISO8601 | null;
  isActive: boolean;
}

export interface BackupSnapshot extends BaseEntity {
  backupJobId: UUID;
  type: BackupType;
  status: SnapshotStatus;
  sizeMb: number;
  filePath: string;
  checksum: string;
  encrypted: boolean;
  compressed: boolean;
  startedAt: ISO8601;
  completedAt?: ISO8601 | null;
  error?: string | null;
  retentionUntil?: ISO8601 | null;
  metadata: Record<string, string>;
}

export type BackupType = 'full' | 'incremental' | 'files' | 'database' | 'mail' | 'dns';
export type BackupScope = 'server' | 'client' | 'subscription' | 'domain';
export type BackupDestination = 'local' | 'sftp' | 's3';
export type JobStatus = 'success' | 'failed' | 'running' | 'pending';
export type SnapshotStatus = 'completed' | 'in_progress' | 'failed' | 'verifying' | 'corrupted';
export type CronExpression = string;

export interface CreateBackupJobInput {
  name: string;
  type: BackupType;
  scope: BackupScope;
  scopeId?: UUID;
  destination: BackupDestination;
  destinationConfig?: Record<string, string>;
  schedule?: string;
  retentionDays?: number;
  encrypt?: boolean;
  compress?: boolean;
  includeFiles?: boolean;
  includeDatabases?: boolean;
  includeMail?: boolean;
  includeDns?: boolean;
}

export interface RestoreBackupInput {
  snapshotId: UUID;
  restoreFiles?: boolean;
  restoreDatabases?: boolean;
  restoreMail?: boolean;
  restoreDns?: boolean;
  targetPath?: string;
}