import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExtensionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.extension.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const ext = await this.prisma.extension.findUnique({ where: { id } });
    if (!ext) throw new NotFoundException('Extension not found');
    return ext;
  }

  async install(data: any) {
    return this.prisma.extension.create({ data });
  }

  async activate(id: string) {
    await this.findOne(id);
    return this.prisma.extension.update({ where: { id }, data: { active: true } });
  }

  async deactivate(id: string) {
    await this.findOne(id);
    return this.prisma.extension.update({ where: { id }, data: { active: false } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.extension.delete({ where: { id } });
  }
}