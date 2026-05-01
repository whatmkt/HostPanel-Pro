import { z } from "zod";

// Auth
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  totpCode: z.string().length(6).optional(),
});

export const setupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(12).max(128),
});

export const twoFactorSetupSchema = z.object({
  secret: z.string(),
  code: z.string().length(6),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email(),
});

export const passwordResetSchema = z.object({
  token: z.string(),
  password: z.string().min(12).max(128),
});

// Users
export const userCreateSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(12).max(128),
  roleId: z.string().uuid(),
  clientId: z.string().uuid().optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  roleId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
});

export const userPasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(12).max(128),
});

// Clients
export const clientCreateSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email(),
  company: z.string().max(200).optional(),
  phone: z.string().max(50).optional(),
  notes: z.string().max(5000).optional(),
  planId: z.string().uuid().optional(),
});

export const clientUpdateSchema = clientCreateSchema.partial();

// Plans
export const hostingPlanCreateSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  price: z.number().min(0),
  billingCycle: z.enum(["monthly", "quarterly", "semiannual", "annual"]),
  diskQuota: z.number().min(0),
  domainLimit: z.number().min(0),
  subdomainLimit: z.number().min(0),
  databaseLimit: z.number().min(0),
  mailboxLimit: z.number().min(0),
  ftpAccountLimit: z.number().min(0),
  backupEnabled: z.boolean(),
  sslEnabled: z.boolean(),
  isActive: z.boolean(),
});

export const hostingPlanUpdateSchema = hostingPlanCreateSchema.partial();

// Domains
export const domainCreateSchema = z.object({
  domainName: z.string().min(3).max(253).regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  clientId: z.string().uuid().optional(),
  subscriptionId: z.string().uuid().optional(),
  rootDirectory: z.string().max(500),
  phpVersion: z.string().max(20).optional(),
  webServer: z.enum(["nginx", "apache", "nginx-apache"]).optional(),
  forceHttps: z.boolean().optional(),
});

export const domainUpdateSchema = domainCreateSchema.partial().extend({
  isActive: z.boolean().optional(),
  isSuspended: z.boolean().optional(),
});

// Email
export const mailboxCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  quota: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const mailboxUpdateSchema = z.object({
  password: z.string().min(8).max(128).optional(),
  quota: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

// Databases
export const databaseCreateSchema = z.object({
  name: z.string().min(1).max(64).regex(/^[a-zA-Z0-9_]+$/),
  type: z.enum(["mysql", "mariadb", "postgresql"]),
  domainId: z.string().uuid(),
  encoding: z.string().max(50).optional(),
});

export const databaseUserCreateSchema = z.object({
  username: z.string().min(1).max(32).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(128),
  databaseId: z.string().uuid(),
  privileges: z.array(z.string()).optional(),
});

// DNS
export const dnsRecordCreateSchema = z.object({
  type: z.enum(["A", "AAAA", "CNAME", "MX", "TXT", "SRV", "CAA", "NS"]),
  name: z.string().max(255),
  value: z.string().max(2000),
  ttl: z.number().min(60).max(86400).optional(),
  priority: z.number().min(0).max(65535).optional(),
});

export const dnsRecordUpdateSchema = dnsRecordCreateSchema.partial();

// Firewall
export const firewallRuleCreateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  type: z.enum(["allow", "deny"]),
  protocol: z.enum(["tcp", "udp", "both"]).optional(),
  port: z.union([z.number().min(1).max(65535), z.string().regex(/^\d+(\:\d+)?$/)]).optional(),
  source: z.string().max(45).optional(),
  sourceCidr: z.string().max(49).optional(),
  service: z.string().max(100).optional(),
  isActive: z.boolean().optional(),
});

// Backups
export const backupJobCreateSchema = z.object({
  name: z.string().min(2).max(200),
  type: z.enum(["full", "files", "database", "email", "dns"]),
  targetId: z.string().uuid().optional(),
  schedule: z.string().max(100).optional(),
  retention: z.number().min(1).max(365).optional(),
  destination: z.enum(["local", "sftp", "s3"]).optional(),
});

// Cron
export const cronJobCreateSchema = z.object({
  name: z.string().min(2).max(200),
  command: z.string().min(1).max(2000),
  schedule: z.string().max(100),
  domainId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
});

// Security/Malware
export const malwareScanCreateSchema = z.object({
  type: z.enum(["full", "domain", "client", "email"]),
  targetId: z.string().uuid().optional(),
});

// Performance
export const performanceProfileCreateSchema = z.object({
  domainId: z.string().uuid(),
  mode: z.enum(["safe", "wordpress", "woocommerce", "maximum", "custom"]),
  gzip: z.boolean().optional(),
  brotli: z.boolean().optional(),
  browserCache: z.boolean().optional(),
  opcache: z.boolean().optional(),
  fastcgiCache: z.boolean().optional(),
  http2: z.boolean().optional(),
});

// Extensions
export const extensionInstallSchema = z.object({
  name: z.string().min(2).max(100),
  version: z.string().max(50).optional(),
});

// Settings
export const settingUpdateSchema = z.object({
  value: z.string(),
});

// API Tokens
export const apiTokenCreateSchema = z.object({
  name: z.string().min(2).max(100),
  permissions: z.array(z.string()).optional(),
  expiresAt: z.string().datetime().optional(),
});

// WordPress
export const wordpressInstallSchema = z.object({
  domainId: z.string().uuid(),
  path: z.string().max(255).optional(),
  title: z.string().max(255),
  adminUser: z.string().max(60),
  adminPassword: z.string().min(12).max(128),
  adminEmail: z.string().email(),
  language: z.string().max(10).optional(),
  plugins: z.array(z.string().max(100)).optional(),
  theme: z.string().max(100).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SetupInput = z.infer<typeof setupSchema>;
export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type ClientCreateInput = z.infer<typeof clientCreateSchema>;
export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>;
export type HostingPlanCreateInput = z.infer<typeof hostingPlanCreateSchema>;
export type DomainCreateInput = z.infer<typeof domainCreateSchema>;
export type DomainUpdateInput = z.infer<typeof domainUpdateSchema>;
export type MailboxCreateInput = z.infer<typeof mailboxCreateSchema>;
export type DatabaseCreateInput = z.infer<typeof databaseCreateSchema>;
export type DnsRecordCreateInput = z.infer<typeof dnsRecordCreateSchema>;
export type FirewallRuleCreateInput = z.infer<typeof firewallRuleCreateSchema>;
export type BackupJobCreateInput = z.infer<typeof backupJobCreateSchema>;
export type CronJobCreateInput = z.infer<typeof cronJobCreateSchema>;
export type WordPressInstallInput = z.infer<typeof wordpressInstallSchema>;