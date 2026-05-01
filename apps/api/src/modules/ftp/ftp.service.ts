import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class FtpService {
  constructor(private prisma: PrismaService) {}
  async findAll() { return this.prisma.ftpAccount.findMany({ include: { domain: true } }); }
  async findById(id: string) { const d = await this.prisma.ftpAccount.findUnique({ where: { id } }); if (!d) throw new NotFoundException(); return d; }
  async create(d: any) { return this.prisma.ftpAccount.create({ data: d }); }
  async update(id: string, d: any) { return this.prisma.ftpAccount.update({ where: { id }, data: d }); }
  async delete(id: string) { return this.prisma.ftpAccount.delete({ where: { id } }); }
}