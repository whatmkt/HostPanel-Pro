// =============================================================================
// Role Entity Types
// =============================================================================

import type { UUID, BaseEntity } from './common';
import type { Permission } from './permission';

export interface Role extends BaseEntity {
  name: string;
  slug: string;
  description?: string | null;
  isSystem: boolean;
  permissions: Permission[];
  userCount?: number;
}

export type RoleSlug =
  | 'superadmin'
  | 'admin'
  | 'reseller'
  | 'client'
  | 'technical'
  | 'readonly';

export const BUILT_IN_ROLES: ReadonlyArray<{ slug: RoleSlug; name: string; description: string }> = [
  {
    slug: 'superadmin',
    name: 'Super Administrador',
    description: 'Acceso total al panel y todos los servidores',
  },
  {
    slug: 'admin',
    name: 'Administrador',
    description: 'Gestión completa del servidor con algunas restricciones',
  },
  {
    slug: 'reseller',
    name: 'Revendedor',
    description: 'Puede crear y gestionar sus propios clientes y suscripciones',
  },
  {
    slug: 'client',
    name: 'Cliente',
    description: 'Gestión de sus propios dominios, webs, correo y bases de datos',
  },
  {
    slug: 'technical',
    name: 'Usuario Técnico',
    description: 'Acceso técnico limitado para soporte y diagnóstico',
  },
  {
    slug: 'readonly',
    name: 'Solo Lectura',
    description: 'Solo puede ver información, no realizar cambios',
  },
] as const;

export interface CreateRoleInput {
  name: string;
  slug: string;
  description?: string;
  permissionIds: UUID[];
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  permissionIds?: UUID[];
}