import type { UUID, Megabytes, BaseEntity } from './common';

export interface MailDomain extends BaseEntity {
  domainId: UUID;
  domainName: string;
  dkimEnabled: boolean;
  dkimSelector: string;
  spfConfigured: boolean;
  dmarcConfigured: boolean;
  catchAllEnabled: boolean;
  catchAllForward?: string | null;
  mailboxCount: number;
  quotaUsedMb: number;
  quotaTotalMb: number;
}

export interface Mailbox extends BaseEntity {
  mailDomainId: UUID;
  email: string;
  hashedPassword: string;
  quotaMb: Megabytes;
  quotaUsedMb: number;
  isActive: boolean;
  lastLoginAt?: string | null;
  autoresponderEnabled: boolean;
  autoresponderSubject?: string | null;
  autoresponderMessage?: string | null;
  spamFilterEnabled: boolean;
  virusFilterEnabled: boolean;
  webmailAccess: boolean;
}

export interface MailAlias extends BaseEntity {
  mailDomainId: UUID;
  source: string;
  destinations: string[];
  isActive: boolean;
}

export interface MailForwarder extends BaseEntity {
  mailDomainId: UUID;
  source: string;
  destination: string;
  isActive: boolean;
  keepCopy: boolean;
}

export interface CreateMailDomainInput {
  domainId: UUID;
  dkimSelector?: string;
  catchAllEnabled?: boolean;
  catchAllForward?: string;
}

export interface CreateMailboxInput {
  mailDomainId: UUID;
  localPart: string;
  password: string;
  quotaMb?: number;
  autoresponderEnabled?: boolean;
  spamFilterEnabled?: boolean;
  virusFilterEnabled?: boolean;
}

export interface UpdateMailboxInput {
  quotaMb?: number;
  isActive?: boolean;
  autoresponderEnabled?: boolean;
  autoresponderSubject?: string;
  autoresponderMessage?: string;
  spamFilterEnabled?: boolean;
  virusFilterEnabled?: boolean;
  webmailAccess?: boolean;
}

export interface MailQueueEntry {
  id: string;
  sender: string;
  recipients: string[];
  size: number;
  arrivalTime: string;
  status: 'active' | 'deferred' | 'bounced';
  errorMsg?: string | null;
}

export interface DkimConfig {
  enabled: boolean;
  selector: string;
  publicKey: string;
  dnsRecord: string;
  status: 'active' | 'pending' | 'failed';
}