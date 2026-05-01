// =============================================================================
// Authentication & Authorization Types
// =============================================================================

import type { UUID, ISO8601, Email } from './common';

export interface LoginRequest {
  email: Email;
  password: string;
  totpCode?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: ISO8601;
  user: AuthUser;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: ISO8601;
}

export interface RegisterFirstAdminRequest {
  name: string;
  email: Email;
  password: string;
}

export type SetupAdminRequest = RegisterFirstAdminRequest;

export interface RegisterFirstAdminResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: ISO8601;
  user: AuthUser;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  email: Email;
}

export interface ResetPasswordConfirmRequest {
  token: string;
  newPassword: string;
}

export interface SetupTotpResponse {
  secret: string;
  qrCodeUrl: string;
}

export interface VerifyTotpRequest {
  code: string;
}

export interface AuthUser {
  id: UUID;
  email: Email;
  name: string;
  role: string;
  permissions: string[];
  avatarUrl?: string | null;
  requiresTotp: boolean;
  totpEnabled: boolean;
}

export interface Session {
  id: UUID;
  userId: UUID;
  ipAddress: string;
  userAgent: string;
  createdAt: ISO8601;
  expiresAt: ISO8601;
  lastActivityAt: ISO8601;
  isCurrent: boolean;
}

export interface LoginAttempt {
  id: UUID;
  email: Email;
  ipAddress: string;
  success: boolean;
  reason?: string | null;
  createdAt: ISO8601;
}

export interface AuthEvent {
  id: UUID;
  userId?: UUID | null;
  event: 'login' | 'logout' | 'failed_login' | 'password_changed' | 'totp_enabled' | 'totp_disabled' | 'session_revoked' | 'account_locked';
  ipAddress: string;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: ISO8601;
}