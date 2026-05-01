import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll() { return this.prisma.client.findMany({ include: { user: true, subscriptions: true } }); }

  async findById(id: string) {
    const c = await this.prisma.client.findUnique({ where: { id }, include: { user: true, subscriptions: { include: { plan: true } }, domains: true } });
    if (!c) throw new NotFoundException('Client not found');
    return c;
  }

  async create(data: { name: string; email: string; company?: string; userId?: string }) {
    return this.prisma.client.create({ data });
  }

  async update(id: string, data: { name?: string; email?: string; company?: string; status?: string }) {
    return this.prisma.client.update({ where: { id }, data });
  }

  async delete(id: string) { return this.prisma.client.delete({ where: { id } }); }
}