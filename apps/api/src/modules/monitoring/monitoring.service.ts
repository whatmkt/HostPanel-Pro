import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);

  constructor(private prisma: PrismaService) {}

  async getMetrics() {
    return {
      cpu: { usage: 23.5, cores: 8 },
      memory: { total: 32, used: 12.8, free: 19.2, unit: 'GB' },
      disk: { total: 500, used: 156, free: 344, unit: 'GB' },
      load: { '1min': 0.45, '5min': 0.38, '15min': 0.42 },
      network: { rx: 45.6, tx: 12.3, unit: 'GB' },
      uptime: '45 days, 12 hours, 23 minutes',
    };
  }

  async getServices() {
    return [
      { name: 'nginx', status: 'running', uptime: '45d 12h' },
      { name: 'php-fpm', status: 'running', uptime: '45d 12h' },
      { name: 'postgresql', status: 'running', uptime: '45d 12h' },
      { name: 'redis', status: 'running', uptime: '45d 12h' },
      { name: 'postfix', status: 'running', uptime: '45d 12h' },
      { name: 'dovecot', status: 'running', uptime: '45d 12h' },
      { name: 'clamav', status: 'running', uptime: '45d 12h' },
      { name: 'fail2ban', status: 'running', uptime: '45d 12h' },
      { name: 'mock-agent', status: 'running', uptime: '45d 12h' },
    ];
  }

  async getAlerts() {
    return [];
  }

  async getAlertRules() {
    return [
      { id: '1', name: 'CPU alta', metric: 'cpu', threshold: 90, enabled: true, channels: ['email'] },
      { id: '2', name: 'RAM alta', metric: 'memory', threshold: 90, enabled: true, channels: ['email'] },
      { id: '3', name: 'Disco casi lleno', metric: 'disk', threshold: 85, enabled: true, channels: ['email', 'webhook'] },
      { id: '4', name: 'Servicio caído', metric: 'service', threshold: 1, enabled: true, channels: ['email'] },
      { id: '5', name: 'SSL próximo a caducar', metric: 'ssl', threshold: 14, enabled: true, channels: ['email'] },
    ];
  }
}