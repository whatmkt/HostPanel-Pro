// =============================================================================
// Permission Entity Types - Granular access control
// =============================================================================

import type { UUID, BaseEntity } from './common';

export interface Permission extends BaseEntity {
  name: string;
  slug: string;
  description?: string | null;
  category: PermissionCategory;
}

export type PermissionCategory =
  | 'dashboard'
  | 'domains'
  | 'dns'
  | 'ssl'
  | 'mail'
  | 'databases'
  | 'files'
  | 'ftp'
  | 'backups'
  | 'performance'
  | 'cache'
  | 'wordpress'
  | 'firewall'
  | 'antivirus'
  | 'logs'
  | 'cron'
  | 'git'
  | 'docker'
  | 'users'
  | 'clients'
  | 'server'
  | 'extensions'
  | 'audit'
  | 'settings';

export type PermissionSlug = string;

export const ALL_PERMISSIONS: ReadonlyArray<{
  slug: PermissionSlug;
  name: string;
  category: PermissionCategory;
}> = [
  // Dashboard
  { slug: 'dashboard.view', name: 'Ver dashboard', category: 'dashboard' },

  // Domains
  { slug: 'domains.create', name: 'Crear dominio', category: 'domains' },
  { slug: 'domains.edit', name: 'Editar dominio', category: 'domains' },
  { slug: 'domains.delete', name: 'Eliminar dominio', category: 'domains' },
  { slug: 'domains.suspend', name: 'Suspender/activar dominio', category: 'domains' },

  // DNS
  { slug: 'dns.view', name: 'Ver DNS', category: 'dns' },
  { slug: 'dns.manage', name: 'Gestionar DNS', category: 'dns' },

  // SSL
  { slug: 'ssl.view', name: 'Ver SSL', category: 'ssl' },
  { slug: 'ssl.manage', name: 'Gestionar SSL', category: 'ssl' },
  { slug: 'ssl.upload', name: 'Subir certificado propio', category: 'ssl' },

  // Mail
  { slug: 'mail.view', name: 'Ver correo', category: 'mail' },
  { slug: 'mail.manage', name: 'Gestionar correo', category: 'mail' },

  // Databases
  { slug: 'databases.view', name: 'Ver bases de datos', category: 'databases' },
  { slug: 'databases.create', name: 'Crear base de datos', category: 'databases' },
  { slug: 'databases.delete', name: 'Eliminar base de datos', category: 'databases' },
  { slug: 'databases.manage', name: 'Gestionar usuarios BD', category: 'databases' },
  { slug: 'databases.import_export', name: 'Importar/Exportar BD', category: 'databases' },

  // Files
  { slug: 'files.view', name: 'Ver archivos', category: 'files' },
  { slug: 'files.edit', name: 'Editar archivos', category: 'files' },
  { slug: 'files.upload', name: 'Subir archivos', category: 'files' },
  { slug: 'files.delete', name: 'Eliminar archivos', category: 'files' },

  // FTP
  { slug: 'ftp.view', name: 'Ver cuentas FTP', category: 'ftp' },
  { slug: 'ftp.manage', name: 'Gestionar cuentas FTP', category: 'ftp' },

  // Backups
  { slug: 'backups.view', name: 'Ver backups', category: 'backups' },
  { slug: 'backups.create', name: 'Crear backup', category: 'backups' },
  { slug: 'backups.restore', name: 'Restaurar backup', category: 'backups' },
  { slug: 'backups.delete', name: 'Eliminar backup', category: 'backups' },
  { slug: 'backups.download', name: 'Descargar backup', category: 'backups' },

  // Performance
  { slug: 'performance.view', name: 'Ver rendimiento', category: 'performance' },
  { slug: 'performance.manage', name: 'Gestionar rendimiento', category: 'performance' },

  // Cache
  { slug: 'cache.view', name: 'Ver caché', category: 'cache' },
  { slug: 'cache.purge', name: 'Purgar caché', category: 'cache' },
  { slug: 'cache.manage', name: 'Gestionar caché', category: 'cache' },

  // WordPress
  { slug: 'wordpress.view', name: 'Ver WordPress', category: 'wordpress' },
  { slug: 'wordpress.install', name: 'Instalar WordPress', category: 'wordpress' },
  { slug: 'wordpress.update', name: 'Actualizar WordPress', category: 'wordpress' },
  { slug: 'wordpress.manage', name: 'Gestionar WordPress', category: 'wordpress' },

  // Firewall
  { slug: 'firewall.view', name: 'Ver firewall', category: 'firewall' },
  { slug: 'firewall.manage', name: 'Gestionar firewall', category: 'firewall' },

  // Antivirus
  { slug: 'antivirus.view', name: 'Ver antivirus', category: 'antivirus' },
  { slug: 'antivirus.scan', name: 'Ejecutar escaneo', category: 'antivirus' },
  { slug: 'antivirus.manage', name: 'Gestionar cuarentena', category: 'antivirus' },

  // Logs
  { slug: 'logs.view', name: 'Ver logs', category: 'logs' },
  { slug: 'logs.download', name: 'Descargar logs', category: 'logs' },

  // Cron
  { slug: 'cron.view', name: 'Ver tareas cron', category: 'cron' },
  { slug: 'cron.manage', name: 'Gestionar tareas cron', category: 'cron' },

  // Git
  { slug: 'git.view', name: 'Ver git deploy', category: 'git' },
  { slug: 'git.manage', name: 'Gestionar git deploy', category: 'git' },

  // Docker
  { slug: 'docker.view', name: 'Ver Docker', category: 'docker' },
  { slug: 'docker.manage', name: 'Gestionar Docker', category: 'docker' },

  // Users
  { slug: 'users.view', name: 'Ver usuarios', category: 'users' },
  { slug: 'users.create', name: 'Crear usuarios', category: 'users' },
  { slug: 'users.edit', name: 'Editar usuarios', category: 'users' },
  { slug: 'users.delete', name: 'Eliminar usuarios', category: 'users' },
  { slug: 'users.manage_roles', name: 'Gestionar roles', category: 'users' },

  // Clients
  { slug: 'clients.view', name: 'Ver clientes', category: 'clients' },
  { slug: 'clients.create', name: 'Crear clientes', category: 'clients' },
  { slug: 'clients.edit', name: 'Editar clientes', category: 'clients' },
  { slug: 'clients.delete', name: 'Eliminar clientes', category: 'clients' },

  // Server
  { slug: 'server.view', name: 'Ver información servidor', category: 'server' },
  { slug: 'server.manage', name: 'Gestionar servidor', category: 'server' },
  { slug: 'server.services', name: 'Gestionar servicios', category: 'server' },
  { slug: 'server.updates', name: 'Gestionar actualizaciones', category: 'server' },

  // Extensions
  { slug: 'extensions.view', name: 'Ver extensiones', category: 'extensions' },
  { slug: 'extensions.install', name: 'Instalar extensiones', category: 'extensions' },
  { slug: 'extensions.manage', name: 'Gestionar extensiones', category: 'extensions' },

  // Audit
  { slug: 'audit.view', name: 'Ver auditoría', category: 'audit' },

  // Settings
  { slug: 'settings.view', name: 'Ver configuración', category: 'settings' },
  { slug: 'settings.edit', name: 'Editar configuración', category: 'settings' },
];

export function getPermissionsByCategory(): Map<PermissionCategory, typeof ALL_PERMISSIONS[number][]> {
  const map = new Map<PermissionCategory, typeof ALL_PERMISSIONS[number][]>();
  for (const perm of ALL_PERMISSIONS) {
    const existing = map.get(perm.category) || [];
    existing.push(perm);
    map.set(perm.category, existing);
  }
  return map;
}

export function getDefaultPermissionsForRole(slug: string): string[] {
  const allSlugs = ALL_PERMISSIONS.map(p => p.slug);
  switch (slug) {
    case 'superadmin':
      return allSlugs;
    case 'admin':
      return allSlugs.filter(s => !s.startsWith('extensions.'));
    case 'reseller':
      return [
        'dashboard.view', 'domains.view', 'domains.create', 'domains.edit', 'domains.suspend',
        'dns.view', 'ssl.view', 'mail.view',
        'databases.view', 'databases.create',
        'files.view', 'ftp.view',
        'backups.view', 'backups.create', 'backups.restore',
        'performance.view', 'cache.view',
        'wordpress.view', 'wordpress.install', 'wordpress.update', 'wordpress.manage',
        'logs.view', 'cron.view',
        'clients.view', 'clients.create', 'clients.edit',
        'users.view',
      ];
    case 'client':
      return [
        'dashboard.view',
        'domains.view', 'domains.create',
        'dns.view', 'dns.manage',
        'ssl.view',
        'mail.view', 'mail.manage',
        'databases.view', 'databases.create', 'databases.manage', 'databases.delete',
        'files.view', 'files.edit', 'files.upload', 'files.delete',
        'ftp.view', 'ftp.manage',
        'backups.view', 'backups.create', 'backups.restore',
        'cache.purge',
        'wordpress.view', 'wordpress.install', 'wordpress.update', 'wordpress.manage',
        'logs.view',
        'cron.view', 'cron.manage',
      ];
    case 'technical':
      return [
        'dashboard.view',
        'domains.view',
        'dns.view', 'ssl.view', 'mail.view',
        'databases.view',
        'files.view',
        'ftp.view',
        'backups.view',
        'performance.view', 'cache.view',
        'wordpress.view',
        'firewall.view', 'antivirus.view',
        'logs.view', 'logs.download',
        'server.view',
        'audit.view',
      ];
    case 'readonly':
      return [
        'dashboard.view', 'domains.view', 'dns.view', 'ssl.view',
        'mail.view', 'databases.view', 'files.view', 'ftp.view',
        'backups.view', 'performance.view', 'cache.view',
        'wordpress.view', 'firewall.view', 'antivirus.view',
        'logs.view', 'server.view', 'audit.view',
      ];
    default:
      return [];
  }
}