import { Controller, Get, UseGuards } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { JwtAuthGuard } from '../auth/auth.module';
import { PermissionsGuard, RequirePermission } from '../../common/guards/permissions.guard';

@Controller('api/v1/monitoring')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MonitoringController {
  constructor(private readonly service: MonitoringService) {}

  @Get('metrics') @RequirePermission('monitoring.view') getMetrics() { return this.service.getMetrics(); }
  @Get('services') @RequirePermission('monitoring.view') getServices() { return this.service.getServices(); }
  @Get('alerts') @RequirePermission('monitoring.view') getAlerts() { return this.service.getAlerts(); }
  @Get('alert-rules') @RequirePermission('monitoring.view') getAlertRules() { return this.service.getAlertRules(); }
}