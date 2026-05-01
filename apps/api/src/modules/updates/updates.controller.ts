import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UpdatesService } from './updates.service';
import { SessionGuard } from '../auth/session.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermission } from '../../common/guards/permissions.guard';

@ApiTags('Updates')
@ApiBearerAuth()
@UseGuards(SessionGuard, PermissionsGuard)
@Controller('api/v1/updates')
export class UpdatesController {
  constructor(private readonly updatesService: UpdatesService) {}

  @Get('version')
  getVersion() { return this.updatesService.getPanelVersion(); }

  @Get('history')
  @RequirePermission('manageServer')
  getHistory() { return this.updatesService.getUpdateHistory(); }

  @Get('check')
  @RequirePermission('manageServer')
  check() { return this.updatesService.checkUpdates(); }
}