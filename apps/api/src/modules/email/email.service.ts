import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class EmailService {
  constructor(private prisma: PrismaService) {}
  async findAll() { return this.prisma.mailDomain.findMany({ include: { domain: true, mailboxes: true } }); }
  async findById(id: string) { const d = await this.prisma.mailDomain.findUnique({ where: { id }, include: { mailboxes: true } }); if (!d) throw new NotFoundException(); return d; }
  async create(d: any) { return this.prisma.mailDomain.create({ data: d }); }
  async update(id: string, d: any) { return this.prisma.mailDomain.update({ where: { id }, data: d }); }
  async delete(id: string) { return this.prisma.mailDomain.delete({ where: { id } }); }
  async createMailbox(domainId: string, d: any) { return this.prisma.mailbox.create({ data: { ...d, mailDomainId: domainId } }); }
  async updateMailbox(id: string, d: any) { return this.prisma.mailbox.update({ where: { id }, data: d }); }
  async deleteMailbox(id: string) { return this.prisma.mailbox.delete({ where: { id } }); }
}