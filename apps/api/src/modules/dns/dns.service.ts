import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class DnsService {
  constructor(private prisma: PrismaService) {}
  async findAll() { return this.prisma.dnsZone.findMany({ include: { domain: true, records: true } }); }
  async findById(id: string) { const d = await this.prisma.dnsZone.findUnique({ where: { id }, include: { records: true } }); if (!d) throw new NotFoundException(); return d; }
  async create(d: any) { return this.prisma.dnsZone.create({ data: d }); }
  async update(id: string, d: any) { return this.prisma.dnsZone.update({ where: { id }, data: d }); }
  async delete(id: string) { return this.prisma.dnsZone.delete({ where: { id } }); }
  async createRecord(zoneId: string, d: any) { return this.prisma.dnsRecord.create({ data: { ...d, zoneId } }); }
  async updateRecord(id: string, d: any) { return this.prisma.dnsRecord.update({ where: { id }, data: d }); }
  async deleteRecord(id: string) { return this.prisma.dnsRecord.delete({ where: { id } }); }
}