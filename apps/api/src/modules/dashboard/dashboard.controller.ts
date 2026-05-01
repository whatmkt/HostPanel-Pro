import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { SessionGuard } from '../auth/session.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Controller('api/v1/dashboard')
@UseGuards(SessionGuard, PermissionsGuard)
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('stats')
  async getStats() {
    return this.service.getDashboardStats();
  }

  @Get('charts')
  async getCharts() {
    return this.service.getCharts();
  }

  @Get('quick-actions')
  async getQuickActions() {
    return this.service.getQuickActions();
  }
}