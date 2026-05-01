import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ServerToolsService } from './server-tools.service';
import { SessionGuard } from '../auth/session.guard';
import { PermissionsGuard, RequirePermission } from '../../common/guards/permissions.guard';

@ApiTags('Server Tools')
@ApiBearerAuth()
@UseGuards(SessionGuard, PermissionsGuard)
@Controller('api/v1/server-tools')
export class ServerToolsController {
  constructor(private readonly service: ServerToolsService) {}

  @Get('services')
  @RequirePermission('manageServer')
  getServices() { return this.service.getServices(); }

  @Get('php-versions')
  @RequirePermission('manageServer')
  getPhpVersions() { return this.service.getPhpVersions(); }

  @Post('services/:name/restart')
  @RequirePermission('manageServer')
  restartService(@Param('name') name: string) { return this.service.restartService(name); }
}