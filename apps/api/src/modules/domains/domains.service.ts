import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class DomainsService {
  constructor(private prisma: PrismaService) {}
  async findAll() { return this.prisma.domain.findMany({ include: { client: true, subscription: true, sslCertificates: true } }); }
  async findById(id: string) { const d = await this.prisma.domain.findUnique({ where: { id }, include: { subdomains: true, aliases: true, dnsZone: true, website: true } }); if (!d) throw new NotFoundException(); return d; }
  async create(d: any) { return this.prisma.domain.create({ data: d }); }
  async update(id: string, d: any) { return this.prisma.domain.update({ where: { id }, data: d }); }
  async delete(id: string) { return this.prisma.domain.delete({ where: { id } }); }
  async suspend(id: string) { return this.prisma.domain.update({ where: { id }, data: { status: 'SUSPENDED' } }); }
  async activate(id: string) { return this.prisma.domain.update({ where: { id }, data: { status: 'ACTIVE' } }); }
}