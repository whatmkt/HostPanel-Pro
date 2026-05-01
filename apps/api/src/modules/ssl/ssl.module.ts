import { Module } from '@nestjs/common';
import { SslService } from './ssl.service';
import { SslController } from './ssl.controller';
import { PrismaModule } from '../../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [SslController], providers: [SslService], exports: [SslService] })
export class SslModule {}