import { Module } from '@nestjs/common';
import { Fail2banService } from './fail2ban.service';
import { Fail2banController } from './fail2ban.controller';

@Module({
  controllers: [Fail2banController],
  providers: [Fail2banService],
  exports: [Fail2banService],
})
export class Fail2banModule {}