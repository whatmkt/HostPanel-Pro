import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { CronService } from './cron.service';
import { JwtAuthGuard } from '../auth/auth.module';
import { PermissionsGuard, RequirePermission } from '../../common/guards/permissions.guard';

@Controller('api/v1/cron')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CronController {
  constructor(private readonly service: CronService) {}

  @Get() @RequirePermission('cron.view') findAll() { return this.service.findAll(); }
  @Post() @RequirePermission('cron.create') create(@Body() dto: any) { return this.service.create(dto); }
  @Put(':id') @RequirePermission('cron.edit') update(@Param('id') id: string, @Body() dto: any) { return this.service.update(id, dto); }
  @Delete(':id') @RequirePermission('cron.delete') remove(@Param('id') id: string) { return this.service.remove(id); }
  @Post(':id/execute') @RequirePermission('cron.execute') executeNow(@Param('id') id: string) { return this.service.executeNow(id); }
  @Post(':id/toggle') @RequirePermission('cron.edit') toggle(@Param('id') id: string, @Body('enabled') enabled: boolean) { return this.service.toggle(id, enabled); }
}