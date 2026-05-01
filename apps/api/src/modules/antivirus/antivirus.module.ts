import { Module } from '@nestjs/common';
import { AntivirusService } from './antivirus.service';
import { AntivirusController } from './antivirus.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { QueueModule } from '../../queue/queue.module';

@Module({
  imports: [PrismaModule, QueueModule],
  controllers: [AntivirusController],
  providers: [AntivirusService],
  exports: [AntivirusService],
})
export class AntivirusModule {}