import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Fail2banService } from './fail2ban.service';
import { SessionGuard } from '../auth/session.guard';
import { PermissionsGuard, RequirePermission } from '../../common/guards/permissions.guard';

@ApiTags('Fail2Ban')
@ApiBearerAuth()
@UseGuards(SessionGuard, PermissionsGuard)
@Controller('api/v1/fail2ban')
export class Fail2banController {
  constructor(private readonly service: Fail2banService) {}

  @Get()
  @RequirePermission('manageFirewall')
  getStatus() { return this.service.getStatus(); }

  @Get('jails')
  @RequirePermission('manageFirewall')
  getJails() { return this.service.getJails(); }

  @Get('banned')
  @RequirePermission('manageFirewall')
  getBanned() { return this.service.getBanned(); }

  @Post('unban')
  @RequirePermission('manageFirewall')
  unban(@Body('ip') ip: string) { return this.service.unban(ip); }

  @Post('ban')
  @RequirePermission('manageFirewall')
  banManually(@Body('ip') ip: string) { return this.service.banManually(ip); }
}