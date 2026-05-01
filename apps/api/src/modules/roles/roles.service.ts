import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.role.findMany({
      include: { permissions: { include: { permission: true } }, _count: { select: { users: true } } },
    });
  }

  async findById(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
      include: { permissions: { include: { permission: true } }, users: true },
    });
  }

  async create(data: { name: string; displayName: string; description?: string }) {
    return this.prisma.role.create({ data });
  }

  async update(id: string, data: { displayName?: string; description?: string }) {
    return this.prisma.role.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.role.delete({ where: { id } });
  }

  async assignPermission(roleId: string, permissionId: string) {
    return this.prisma.rolePermission.create({ data: { roleId, permissionId } });
  }

  async removePermission(roleId: string, permissionId: string) {
    return this.prisma.rolePermission.deleteMany({ where: { roleId, permissionId } });
  }

  async getAllPermissions() {
    return this.prisma.permission.findMany();
  }
}