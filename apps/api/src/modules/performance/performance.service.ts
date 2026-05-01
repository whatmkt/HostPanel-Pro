import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PerformanceService {
  private readonly logger = new Logger(PerformanceService.name);

  constructor(private prisma: PrismaService) {}

  async getServerPerformance() {
    const settings = await this.prisma.setting.findMany();
    const perfProfiles = await this.prisma.performanceProfile.count();
    const cacheRules = await this.prisma.cacheRule.count();
    return {
      profiles: perfProfiles,
      cacheRules,
      modes: ['safe', 'wordpress', 'woocommerce', 'maximum', 'custom'],
      recommendations: [
        'Enable OPcache for all PHP versions',
        'Configure gzip compression in nginx',
        'Set browser cache headers for static assets',
        'Consider enabling FastCGI cache for WordPress sites',
      ],
    };
  }

  async getPerformanceProfiles() {
    return this.prisma.performanceProfile.findMany({
      include: { domain: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPerformanceProfile(id: string) {
    return this.prisma.performanceProfile.findUnique({
      where: { id },
      include: { domain: true },
    });
  }

  async createPerformanceProfile(data: {
    domainId: string;
    mode: string;
    gzip: boolean;
    brotli: boolean;
    browserCache: boolean;
    opcache: boolean;
    fastcgiCache: boolean;
    microCache: boolean;
    excludedUrls?: string;
    excludedCookies?: string;
    bypassLoggedIn: boolean;
    status: string;
  }) {
    const profile = await this.prisma.performanceProfile.create({ data });
    // Queue agent job to apply performance settings
    return profile;
  }

  async updatePerformanceProfile(
    id: string,
    data: Record<string, unknown>,
  ) {
    return this.prisma.performanceProfile.update({ where: { id }, data });
  }

  async deletePerformanceProfile(id: string) {
    return this.prisma.performanceProfile.delete({ where: { id } });
  }

  async getCacheRules() {
    return this.prisma.cacheRule.findMany({
      include: { domain: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCacheRule(data: {
    domainId: string;
    type: string;
    path: string;
    ttl: number;
    status: string;
  }) {
    return this.prisma.cacheRule.create({ data });
  }

  async deleteCacheRule(id: string) {
    return this.prisma.cacheRule.delete({ where: { id } });
  }

  async getWebOptimizationSettings() {
    return this.prisma.webOptimizationSetting.findMany({
      include: { domain: true },
    });
  }

  async applyOptimizationMode(domainId: string, mode: string) {
    const modes: Record<string, Record<string, unknown>> = {
      safe: {
        opcache: true,
        gzip: true,
        browserCache: true,
        fastcgiCache: false,
        microCache: false,
      },
      wordpress: {
        opcache: true,
        gzip: true,
        browserCache: true,
        fastcgiCache: true,
        microCache: false,
        protectWpAdmin: true,
        protectWpLogin: true,
      },
      woocommerce: {
        opcache: true,
        gzip: true,
        browserCache: true,
        fastcgiCache: true,
        microCache: false,
        excludeCart: true,
        excludeCheckout: true,
        excludeMyAccount: true,
        bypassLoggedIn: true,
      },
      maximum: {
        opcache: true,
        gzip: true,
        brotli: true,
        browserCache: true,
        fastcgiCache: true,
        microCache: true,
      },
    };

    const settings = modes[mode];
    if (!settings) throw new Error(`Unknown mode: ${mode}`);

    const profile = await this.prisma.performanceProfile.create({
      data: {
        domainId,
        mode,
        status: 'applied',
      },
    });

    return { profile, settings };
  }

  async purgeCache(domainId?: string) {
    // Queue agent job to purge nginx cache
    this.logger.log(`Purging cache for domain: ${domainId || 'all'}`);
    return { status: 'purged', domainId: domainId || 'all' };
  }

  async getPerformanceHistory(domainId: string) {
    return this.prisma.performanceProfile.findMany({
      where: { domainId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}