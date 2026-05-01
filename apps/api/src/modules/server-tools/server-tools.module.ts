import { Module } from '@nestjs/common';
import { ServerToolsService } from './server-tools.service';
import { ServerToolsController } from './server-tools.controller';

@Module({
  controllers: [ServerToolsController],
  providers: [ServerToolsService],
  exports: [ServerToolsService],
})
export class ServerToolsModule {}