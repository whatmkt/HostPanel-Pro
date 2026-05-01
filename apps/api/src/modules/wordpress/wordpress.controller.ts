import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WordPressService } from './wordpress.service';
import { SessionGuard } from '../auth/session.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermission } from '../../common/guards/permissions.guard';

@ApiTags('WordPress')
@ApiBearerAuth()
@UseGuards(SessionGuard, PermissionsGuard)
@Controller('api/v1/wordpress')
export class WordPressController {
  constructor(private readonly wpService: WordPressService) {}

  @Get()
  @RequirePermission('manageWordPress')
  findAll() { return this.wpService.findAll(); }

  @Post('install')
  @RequirePermission('manageWordPress')
  install(@Body() data: any) { return this.wpService.install(data); }

  @Post(':id/core-update')
  @RequirePermission('manageWordPress')
  updateCore(@Param('id') id: string) { return this.wpService.updateCore(id); }

  @Post(':id/plugins-update')
  @RequirePermission('manageWordPress')
  updatePlugins(@Param('id') id: string) { return this.wpService.updatePlugins(id); }

  @Post(':id/hardening')
  @RequirePermission('manageWordPress')
  hardening(@Param('id') id: string) { return this.wpService.hardening(id); }

  @Post(':id/staging')
  @RequirePermission('manageWordPress')
  createStaging(@Param('id') id: string) { return this.wpService.createStaging(id); }

  @Put(':id/maintenance')
  @RequirePermission('manageWordPress')
  setMaintenance(@Param('id') id: string, @Body() data: { enabled: boolean }) {
    return this.wpService.setMaintenanceMode(id, data.enabled);
  }
}