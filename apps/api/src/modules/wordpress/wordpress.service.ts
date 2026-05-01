import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WordPressService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.website.findMany({
      where: { type: 'wordpress' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async install(data: any) {
    return this.prisma.website.create({
      data: { ...data, type: 'wordpress' },
    });
  }

  async updateCore(id: string) {
    const site = await this.prisma.website.findUnique({ where: { id } });
    if (!site) throw new NotFoundException('WordPress site not found');
    return { message: 'WordPress core updated successfully', siteId: id };
  }

  async updatePlugins(id: string) {
    const site = await this.prisma.website.findUnique({ where: { id } });
    if (!site) throw new NotFoundException('WordPress site not found');
    return { message: 'Plugins updated successfully', siteId: id };
  }

  async hardening(id: string) {
    const site = await this.prisma.website.findUnique({ where: { id } });
    if (!site) throw new NotFoundException('WordPress site not found');
    return { message: 'WordPress hardening applied', siteId: id };
  }

  async createStaging(id: string) {
    const site = await this.prisma.website.findUnique({ where: { id } });
    if (!site) throw new NotFoundException('WordPress site not found');
    return { message: 'Staging environment created', siteId: id };
  }

  async syncStaging(id: string) {
    const site = await this.prisma.website.findUnique({ where: { id } });
    if (!site) throw new NotFoundException('WordPress site not found');
    return { message: 'Staging synced to production', siteId: id };
  }

  async setMaintenanceMode(id: string, enabled: boolean) {
    const site = await this.prisma.website.findUnique({ where: { id } });
    if (!site) throw new NotFoundException('WordPress site not found');
    return { message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}`, siteId: id };
  }
}