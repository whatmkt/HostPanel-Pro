import type { UUID, BaseEntity } from './common';

export interface DnsZone extends BaseEntity {
  domainId: UUID;
  domainName: string;
  type: 'master' | 'slave';
  soa: SoaRecord;
  ttl: number;
  serial: number;
  refresh: number;
  retry: number;
  expire: number;
  minimum: number;
  recordCount: number;
  dnssecEnabled: boolean;
  templateApplied?: string | null;
}

export interface DnsRecord extends BaseEntity {
  zoneId: UUID;
  type: DnsRecordType;
  name: string;
  content: string;
  ttl: number;
  priority?: number | null;
  weight?: number | null;
  port?: number | null;
  flag?: number | null;
  tag?: string | null;
}

export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'SRV' | 'CAA' | 'NS' | 'PTR';

export interface SoaRecord {
  mname: string;
  rname: string;
  serial: number;
  refresh: number;
  retry: number;
  expire: number;
  minimum: number;
}

export interface CreateZoneInput {
  domainId: UUID;
  templateName?: string;
  soa?: Partial<SoaRecord>;
  ttl?: number;
}

export interface CreateRecordInput {
  zoneId: UUID;
  type: DnsRecordType;
  name: string;
  content: string;
  ttl?: number;
  priority?: number;
  weight?: number;
  port?: number;
  flag?: number;
  tag?: string;
}

export interface UpdateRecordInput {
  type?: DnsRecordType;
  name?: string;
  content?: string;
  ttl?: number;
  priority?: number;
  weight?: number;
  port?: number;
}

export const DNS_TEMPLATES: Record<string, DnsRecordTemplate[]> = {
  default: [
    { type: 'A', name: '@', content: '{IP}', ttl: 3600 },
    { type: 'A', name: 'www', content: '{IP}', ttl: 3600 },
    { type: 'MX', name: '@', content: 'mail.{DOMAIN}', priority: 10, ttl: 3600 },
    { type: 'TXT', name: '@', content: 'v=spf1 a mx ~all', ttl: 3600 },
    { type: 'CNAME', name: 'mail', content: '{DOMAIN}', ttl: 3600 },
  ],
  google_mail: [
    { type: 'A', name: '@', content: '{IP}', ttl: 3600 },
    { type: 'A', name: 'www', content: '{IP}', ttl: 3600 },
    { type: 'MX', name: '@', content: 'ASPMX.L.GOOGLE.COM', priority: 1, ttl: 3600 },
    { type: 'MX', name: '@', content: 'ALT1.ASPMX.L.GOOGLE.COM', priority: 5, ttl: 3600 },
    { type: 'MX', name: '@', content: 'ALT2.ASPMX.L.GOOGLE.COM', priority: 5, ttl: 3600 },
    { type: 'TXT', name: '@', content: 'v=spf1 include:_spf.google.com ~all', ttl: 3600 },
  ],
};

export interface DnsRecordTemplate {
  type: DnsRecordType;
  name: string;
  content: string;
  ttl: number;
  priority?: number;
}