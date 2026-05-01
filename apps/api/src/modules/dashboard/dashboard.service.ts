import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    return {
      system: {
        cpu: { usage: 23.5, cores: 8, model: 'Intel Xeon E-2288G' },
        memory: { total: 32, used: 12.8, free: 19.2, unit: 'GB' },
        disk: { total: 500, used: 156, free: 344, unit: 'GB' },
        load: { '1min': 0.45, '5min': 0.38, '15min': 0.42 },
        uptime: '45 days, 12 hours, 23 minutes',
        network: { rx: 45.6, tx: 12.3, unit: 'GB' },
      },
      services: {
        running: ['nginx', 'php-fpm', 'postgresql', 'redis', 'mock-agent'],
        stopped: [],
      },
      counts: {
        domains: 24,
        databases: 18,
        mailboxes: 45,
        sslCertificates: 22,
        sslExpiringSoon: 3,
        backupsRecent: 7,
      },
      alerts: {
        critical: 0,
        warnings: 2,
        updates: 5,
      },
      lastEvents: [
        { type: 'info', message: 'SSL certificate renewed for example.com', time: '2 hours ago' },
        { type: 'warning', message: 'Disk usage above 30%', time: '5 hours ago' },
        { type: 'info', message: 'Backup completed for client Acme Corp', time: '8 hours ago' },
      ],
    };
  }

  async getCharts() {
    return {
      cpuHistory: [],
      memoryHistory: [],
      diskHistory: [],
      networkHistory: [],
      requestsHistory: [],
      errorsHistory: [],
      phpFpmHistory: [],
    };
  }

  async getQuickActions() {
    return [
      { id: 'create-domain', label: 'Create Domain', icon: 'Globe' },
      { id: 'create-database', label: 'Create Database', icon: 'Database' },
      { id: 'create-mailbox', label: 'Create Mailbox', icon: 'Mail' },
      { id: 'install-wordpress', label: 'Install WordPress', icon: 'Wordpress' },
      { id: 'view-backups', label: 'View Backups', icon: 'HardDrive' },
      { id: 'scan-malware', label: 'Scan Malware', icon: 'Shield' },
    ];
  }
}