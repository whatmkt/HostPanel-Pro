import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);

  constructor(
    private prisma: PrismaService,
    @InjectQueue('security') private securityQueue: Queue,
  ) {}

  async getStatus() {
    return {
      firewall: await this.prisma.firewallRule.count({ where: { enabled: true } }),
      fail2ban: await this.prisma.fail2BanJail.count({ where: { enabled: true } }),
      scanResults: await this.prisma.malwareScan.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      totalBanned: await this.prisma.fail2BanBan.count({ where: { active: true } }),
    };
  }

  async getFirewallRules() {
    return this.prisma.firewallRule.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async addFirewallRule(data: { port?: number; protocol?: string; ip?: string; cidr?: string; action: string; description?: string }) {
    return this.prisma.firewallRule.create({ data });
  }

  async deleteFirewallRule(id: string) {
    return this.prisma.firewallRule.delete({ where: { id } });
  }

  async getFail2BanJails() {
    return this.prisma.fail2BanJail.findMany();
  }

  async updateJail(id: string, data: { enabled?: boolean; maxRetry?: number; findTime?: number; banTime?: number }) {
    return this.prisma.fail2BanJail.update({ where: { id }, data });
  }

  async unbanIp(id: string) {
    return this.prisma.fail2BanBan.update({ where: { id }, data: { active: false } });
  }

  async getBannedIps() {
    return this.prisma.fail2BanBan.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } });
  }
}