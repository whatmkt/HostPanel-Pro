import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}
  async findAll() { return this.prisma.hostingPlan.findMany(); }
  async findById(id: string) { const p = await this.prisma.hostingPlan.findUnique({ where: { id } }); if (!p) throw new NotFoundException('Plan not found'); return p; }
  async create(d: any) { return this.prisma.hostingPlan.create({ data: d }); }
  async update(id: string, d: any) { return this.prisma.hostingPlan.update({ where: { id }, data: d }); }
  async delete(id: string) { return this.prisma.hostingPlan.delete({ where: { id } }); }
}