import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { SessionGuard } from '../auth/session.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermission } from '../../common/guards/permissions.guard';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(SessionGuard, PermissionsGuard)
@Controller('api/v1/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @RequirePermission('manageServer')
  getAll() { return this.settingsService.getAll(); }

  @Get(':key')
  @RequirePermission('manageServer')
  get(@Req() req: any) { return this.settingsService.get(req.params.key); }

  @Put(':key')
  @RequirePermission('manageServer')
  update(@Req() req: any, @Body() body: { value: string }) {
    return this.settingsService.set(req.params.key, body.value, req.user.id);
  }
}