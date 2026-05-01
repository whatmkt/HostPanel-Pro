import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}
  async findAll() { return this.prisma.subscription.findMany({ include: { plan: true, client: true } }); }
  async findById(id: string) { const s = await this.prisma.subscription.findUnique({ where: { id }, include: { plan: true, client: true } }); if (!s) throw new NotFoundException(); return s; }
  async create(d: any) { return this.prisma.subscription.create({ data: d }); }
  async update(id: string, d: any) { return this.prisma.subscription.update({ where: { id }, data: d }); }
  async delete(id: string) { return this.prisma.subscription.delete({ where: { id } }); }
}