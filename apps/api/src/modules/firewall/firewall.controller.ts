import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FirewallService } from './firewall.service';
import { SessionGuard } from '../auth/session.guard';
import { PermissionsGuard, RequirePermission } from '../../common/guards/permissions.guard';

@ApiTags('Firewall')
@ApiBearerAuth()
@UseGuards(SessionGuard, PermissionsGuard)
@Controller('api/v1/firewall')
export class FirewallController {
  constructor(private readonly service: FirewallService) {}

  @Get()
  @RequirePermission('manageFirewall')
  getStatus() { return this.service.getStatus(); }

  @Get('rules')
  @RequirePermission('manageFirewall')
  getRules() { return this.service.getRules(); }

  @Post('rules')
  @RequirePermission('manageFirewall')
  addRule(@Body() body: any) { return this.service.addRule(body); }

  @Delete('rules/:id')
  @RequirePermission('manageFirewall')
  deleteRule(@Param('id') id: string) { return this.service.deleteRule(id); }
}