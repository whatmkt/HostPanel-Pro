import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),
    BullModule.registerQueue(
      { name: 'domains' },
      { name: 'ssl' },
      { name: 'dns' },
      { name: 'mail' },
      { name: 'databases' },
      { name: 'files' },
      { name: 'backups' },
      { name: 'security' },
      { name: 'antivirus' },
      { name: 'performance' },
      { name: 'cron' },
      { name: 'git' },
      { name: 'docker' },
      { name: 'wordpress' },
      { name: 'notifications' },
      { name: 'audit' },
    ),
  ],
  exports: [BullModule],
})
export class QueueModule {}