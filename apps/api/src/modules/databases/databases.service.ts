import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class DatabasesService {
  constructor(private prisma: PrismaService) {}
  async findAll() { return this.prisma.database.findMany({ include: { domain: true, users: true } }); }
  async findById(id: string) { const d = await this.prisma.database.findUnique({ where: { id }, include: { users: true } }); if (!d) throw new NotFoundException(); return d; }
  async create(d: any) { return this.prisma.database.create({ data: d }); }
  async update(id: string, d: any) { return this.prisma.database.update({ where: { id }, data: d }); }
  async delete(id: string) { return this.prisma.database.delete({ where: { id } }); }
  async createUser(dbId: string, d: any) { return this.prisma.databaseUser.create({ data: { ...d, databaseId: dbId } }); }
  async deleteUser(id: string) { return this.prisma.databaseUser.delete({ where: { id } }); }
}