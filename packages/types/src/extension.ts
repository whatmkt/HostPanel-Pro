import type { UUID, BaseEntity } from './common';

export interface Extension extends BaseEntity {
  name: string;
  slug: string;
  version: string;
  description: string;
  author: string;
  homepage?: string | null;
  enabled: boolean;
  configSchema?: Record<string, unknown> | null;
  configValues?: Record<string, unknown> | null;
  permissions: string[];
  menuItems: ExtensionMenuItem[];
  dashboardWidgets: ExtensionWidget[];
  hooks: string[];
}

export interface ExtensionMenuItem {
  label: string;
  path: string;
  icon?: string;
  parentMenu?: string;
  order?: number;
  requiredPermission?: string;
}

export interface ExtensionWidget {
  id: string;
  title: string;
  component: string;
  size: 'small' | 'medium' | 'large' | 'full';
  order?: number;
}

export interface Setting extends BaseEntity {
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  group: string;
  label: string;
  description?: string | null;
  editable: boolean;
  hidden: boolean;
}

export interface ApiToken extends BaseEntity {
  userId: UUID;
  name: string;
  token: string;
  lastUsedAt?: string | null;
  expiresAt?: string | null;
  permissions: string[];
  isActive: boolean;
}

export interface CreateApiTokenInput {
  name: string;
  permissions: string[];
  expiresAt?: string;
}