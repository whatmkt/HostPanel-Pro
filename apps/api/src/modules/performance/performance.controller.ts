import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { SessionGuard } from '../auth/session.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Controller('api/v1/performance')
@UseGuards(SessionGuard, PermissionsGuard)
export class PerformanceController {
  constructor(private readonly service: PerformanceService) {}

  @Get('server')
  async getServerPerformance() {
    return this.service.getServerPerformance();
  }

  @Get('profiles')
  async getProfiles() {
    return this.service.getPerformanceProfiles();
  }

  @Get('profiles/:id')
  async getProfile(@Param('id') id: string) {
    return this.service.getPerformanceProfile(id);
  }

  @Post('profiles')
  @HttpCode(201)
  async createProfile(@Body() data: any) {
    return this.service.createPerformanceProfile(data);
  }

  @Put('profiles/:id')
  async updateProfile(@Param('id') id: string, @Body() data: any) {
    return this.service.updatePerformanceProfile(id, data);
  }

  @Delete('profiles/:id')
  @HttpCode(204)
  async deleteProfile(@Param('id') id: string) {
    return this.service.deletePerformanceProfile(id);
  }

  @Get('cache-rules')
  async getCacheRules() {
    return this.service.getCacheRules();
  }

  @Post('cache-rules')
  @HttpCode(201)
  async createCacheRule(@Body() data: any) {
    return this.service.createCacheRule(data);
  }

  @Delete('cache-rules/:id')
  @HttpCode(204)
  async deleteCacheRule(@Param('id') id: string) {
    return this.service.deleteCacheRule(id);
  }

  @Get('web-optimization')
  async getWebOptimization() {
    return this.service.getWebOptimizationSettings();
  }

  @Post('apply/:domainId')
  async applyMode(
    @Param('domainId') domainId: string,
    @Body('mode') mode: string,
  ) {
    return this.service.applyOptimizationMode(domainId, mode);
  }

  @Post('purge')
  async purgeCache(@Body('domainId') domainId?: string) {
    return this.service.purgeCache(domainId);
  }

  @Get('history/:domainId')
  async getHistory(@Param('domainId') domainId: string) {
    return this.service.getPerformanceHistory(domainId);
  }
}