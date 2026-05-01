import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class SslService {
  constructor(private prisma: PrismaService) {}
  async findAll() { return this.prisma.sslCertificate.findMany({ include: { domain: true } }); }
  async findById(id: string) { const s = await this.prisma.sslCertificate.findUnique({ where: { id }, include: { domain: true } }); if (!s) throw new NotFoundException(); return s; }
  async create(d: any) { return this.prisma.sslCertificate.create({ data: d }); }
  async update(id: string, d: any) { return this.prisma.sslCertificate.update({ where: { id }, data: d }); }
  async delete(id: string) { return this.prisma.sslCertificate.delete({ where: { id } }); }
  async issue(id: string) { return this.prisma.sslCertificate.update({ where: { id }, data: { status: 'ISSUING' } }); }
  async revoke(id: string) { return this.prisma.sslCertificate.update({ where: { id }, data: { status: 'REVOKED' } }); }
}