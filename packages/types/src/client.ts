import type { UUID, Email, ISO8601, BaseEntity } from './common';

export interface Client extends BaseEntity {
  name: string;
  email: Email;
  phone?: string | null;
  company?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  taxId?: string | null;
  notes?: string | null;
  isActive: boolean;
  userId?: UUID | null;
  subscriptionCount?: number;
  domainCount?: number;
}

export interface CreateClientInput {
  name: string;
  email: Email;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  notes?: string;
}

export interface UpdateClientInput {
  name?: string;
  email?: Email;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  notes?: string;
  isActive?: boolean;
}