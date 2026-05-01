import type { UUID, BaseEntity } from './common';

export interface FtpAccount extends BaseEntity {
  domainId: UUID;
  username: string;
  hashedPassword: string;
  homeDirectory: string;
  protocol: 'ftp' | 'sftp';
  isActive: boolean;
  lastAccessAt?: string | null;
  lastAccessIp?: string | null;
}

export interface CreateFtpAccountInput {
  domainId: UUID;
  username: string;
  password: string;
  homeDirectory: string;
  protocol?: 'ftp' | 'sftp';
}

export interface UpdateFtpAccountInput {
  homeDirectory?: string;
  isActive?: boolean;
}