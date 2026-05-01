import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GitService {
  private readonly logger = new Logger(GitService.name);
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return [
      { id: '1', domain: 'example.com', repository: 'github.com/user/example-site', branch: 'main', path: '/var/www/example.com', status: 'deployed', lastDeploy: new Date().toISOString(), webhookSecret: 'wh_***' },
      { id: '2', domain: 'mysite.com', repository: 'gitlab.com/team/mysite', branch: 'production', path: '/var/www/mysite.com', status: 'pending', lastDeploy: null, webhookSecret: 'wh_***' },
    ];
  }

  async create(data: any) { return { id: 'new', ...data, status: 'cloning', lastDeploy: null }; }
  async update(id: string, data: any) { return { id, ...data }; }
  async remove(id: string) { return { deleted: true, id }; }
  async deploy(id: string) { return { id, status: 'deployed', timestamp: new Date().toISOString() }; }
  async rollback(id: string) { return { id, status: 'rollback', timestamp: new Date().toISOString() }; }
}