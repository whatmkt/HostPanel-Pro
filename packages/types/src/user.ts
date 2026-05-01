// =============================================================================
// User Entity Types
// =============================================================================

import type { UUID, ISO8601, Email, BaseEntity } from './common';
import type { Role } from './role';

export interface User extends BaseEntity {
  email: Email;
  name: string;
  hashedPassword: string;
  roleId: UUID;
  isActive: boolean;
  isLocked: boolean;
  lockedUntil?: ISO8601 | null;
  failedLoginAttempts: number;
  totpEnabled: boolean;
  totpSecret?: string | null;
  avatarUrl?: string | null;
  lastLoginAt?: ISO8601 | null;
  lastLoginIp?: string | null;
  passwordChangedAt?: ISO8601 | null;
  requirePasswordChange: boolean;
  role?: Role | null;
}

export interface UserProfile extends BaseEntity {
  email: Email;
  name: string;
  role: string;
  roleId: UUID;
  isActive: boolean;
  totpEnabled: boolean;
  avatarUrl?: string | null;
  lastLoginAt?: ISO8601 | null;
  createdAt: ISO8601;
}

export interface CreateUserInput {
  email: Email;
  name: string;
  password: string;
  roleId: UUID;
  isActive?: boolean;
  requirePasswordChange?: boolean;
}

export interface UpdateUserInput {
  name?: string;
  email?: Email;
  roleId?: UUID;
  isActive?: boolean;
  requirePasswordChange?: boolean;
}

export interface UpdateProfileInput {
  name?: string;
  avatarUrl?: string;
}

export interface UserListParams {
  search?: string;
  roleId?: UUID;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}