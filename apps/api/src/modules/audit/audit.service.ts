import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: { userId?: string; action: string; resource: string; resourceId?: string; ip?: string; details?: any; before?: any; after?: any }) {
    return this.prisma.auditLog.create({ data });
  }

  async findAll(params: { skip?: number; take?: number; action?: string; resource?: string; userId?: string }) {
    const { skip = 0, take = 50, ...where } = params;
    return this.prisma.auditLog.findMany({ where: where as any, skip, take, orderBy: { createdAt: 'desc' } });
  }

  async count() { return this.prisma.auditLog.count(); }
}