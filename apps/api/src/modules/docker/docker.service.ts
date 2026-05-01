import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DockerService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.dockerContainer.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const container = await this.prisma.dockerContainer.findUnique({ where: { id } });
    if (!container) throw new NotFoundException('Docker container not found');
    return container;
  }

  async create(data: any) {
    return this.prisma.dockerContainer.create({ data });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.dockerContainer.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.dockerContainer.delete({ where: { id } });
  }

  async start(id: string) {
    await this.findOne(id);
    return this.prisma.dockerContainer.update({ where: { id }, data: { status: 'running' } });
  }

  async stop(id: string) {
    await this.findOne(id);
    return this.prisma.dockerContainer.update({ where: { id }, data: { status: 'stopped' } });
  }

  async restart(id: string) {
    await this.findOne(id);
    return this.prisma.dockerContainer.update({ where: { id }, data: { status: 'running' } });
  }
}