import type { UUID, BaseEntity } from './common';

export interface Database extends BaseEntity {
  name: string;
  type: DatabaseType;
  domainId?: UUID | null;
  subscriptionId?: UUID | null;
  serverId?: UUID | null;
  charset: string;
  collation: string;
  sizeMb: number;
  tableCount: number;
  status: 'active' | 'suspended' | 'error';
  remoteAccess: boolean;
  remoteIps: string[];
  lastBackupAt?: string | null;
}

export type DatabaseType = 'mysql' | 'mariadb' | 'postgresql';

export interface DatabaseUser extends BaseEntity {
  databaseId: UUID;
  username: string;
  hashedPassword: string;
  host: string;
  privileges: DatabasePrivilege[];
  isActive: boolean;
}

export type DatabasePrivilege = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'CREATE' | 'DROP' | 'ALTER' | 'INDEX' | 'REFERENCES' | 'GRANT';

export interface CreateDatabaseInput {
  name: string;
  type: DatabaseType;
  domainId?: UUID;
  subscriptionId?: UUID;
  charset?: string;
  collation?: string;
  remoteAccess?: boolean;
  remoteIps?: string[];
}

export interface CreateDatabaseUserInput {
  databaseId: UUID;
  username: string;
  password: string;
  host?: string;
  privileges?: DatabasePrivilege[];
}

export interface UpdateDatabaseUserInput {
  privileges?: DatabasePrivilege[];
  isActive?: boolean;
  host?: string;
}

export interface DatabaseTable {
  name: string;
  engine: string;
  rows: number;
  sizeMb: number;
  collation: string;
}