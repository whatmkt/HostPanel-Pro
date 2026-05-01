import type { UUID, BaseEntity } from './common';

export interface Server extends BaseEntity {
  hostname: string;
  ipAddress: string;
  osName: string;
  osVersion: string;
  kernel: string;
  architecture: string;
  cpuCores: number;
  ramTotalMb: number;
  diskTotalMb: number;
  panelVersion: string;
  agentVersion: string;
  status: 'online' | 'offline' | 'maintenance';
  lastHeartbeat?: string | null;
  location?: string | null;
  dataCenter?: string | null;
  tags: string[];
}

export interface ServerService extends BaseEntity {
  serverId: UUID;
  serviceName: string;
  displayName: string;
  status: 'running' | 'stopped' | 'failed' | 'not_installed';
  autoStart: boolean;
  port?: number | null;
  version?: string | null;
  configPath?: string | null;
  lastRestartAt?: string | null;
}

export interface CronJob extends BaseEntity {
  userId?: UUID | null;
  domainId?: UUID | null;
  name: string;
  expression: string;
  command: string;
  type: 'php_script' | 'http_url' | 'shell_command' | 'wp_cron';
  isActive: boolean;
  lastRunAt?: string | null;
  lastExitCode?: number | null;
  lastOutput?: string | null;
  lastError?: string | null;
  nextRunAt?: string | null;
  timeoutSeconds: number;
  retryOnFailure: boolean;
  maxRetries: number;
}

export interface GitDeployment extends BaseEntity {
  domainId: UUID;
  repositoryUrl: string;
  branch: string;
  deployPath: string;
  webhookSecret?: string | null;
  postDeployCommands: string[];
  environmentVariables: Record<string, string>;
  status: 'connected' | 'deploying' | 'failed' | 'idle';
  lastDeployAt?: string | null;
  lastDeployCommit?: string | null;
  lastDeployStatus?: string | null;
  autoDeploy: boolean;
}

export interface DockerContainer extends BaseEntity {
  name: string;
  image: string;
  containerId?: string | null;
  status: 'running' | 'stopped' | 'paused' | 'restarting' | 'error';
  ports: string[];
  volumes: string[];
  environment: Record<string, string>;
  restartPolicy: 'no' | 'always' | 'unless-stopped' | 'on-failure';
  memoryLimitMb?: number | null;
  cpuLimit?: number | null;
  createdFromTemplate?: string | null;
}

export interface WordPressInstallation extends BaseEntity {
  domainId: UUID;
  siteUrl: string;
  version: string;
  language: string;
  adminUser: string;
  dbName: string;
  dbUser: string;
  tablePrefix: string;
  autoUpdateCore: boolean;
  autoUpdatePlugins: boolean;
  autoUpdateThemes: boolean;
  maintenanceMode: boolean;
  hardeningApplied: boolean;
  xmlrpcDisabled: boolean;
  wpLoginProtected: boolean;
  redisCacheEnabled: boolean;
  nginxCacheEnabled: boolean;
  installedPlugins: string[];
  installedThemes: string[];
  lastScanAt?: string | null;
  malwareDetected: number;
}

export interface CreateCronJobInput {
  userId?: UUID;
  domainId?: UUID;
  name: string;
  expression: string;
  command: string;
  type: 'php_script' | 'http_url' | 'shell_command' | 'wp_cron';
  timeoutSeconds?: number;
  retryOnFailure?: boolean;
  maxRetries?: number;
}

export interface CreateGitDeploymentInput {
  domainId: UUID;
  repositoryUrl: string;
  branch?: string;
  deployPath: string;
  postDeployCommands?: string[];
  environmentVariables?: Record<string, string>;
  autoDeploy?: boolean;
}

export interface CreateDockerContainerInput {
  name: string;
  image: string;
  ports?: string[];
  volumes?: string[];
  environment?: Record<string, string>;
  restartPolicy?: 'no' | 'always' | 'unless-stopped' | 'on-failure';
  memoryLimitMb?: number;
  cpuLimit?: number;
  templateName?: string;
  enablePrivileged?: boolean;
}