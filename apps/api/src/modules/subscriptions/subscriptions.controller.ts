import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/auth.module';
import { PermissionsGuard, RequirePermission } from '../../common/guards/permissions.guard';
@Controller('api/v1/subscriptions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SubscriptionsController {
  constructor(private readonly s: SubscriptionsService) {}
  @Get() @RequirePermission('subscriptions.manage') findAll() { return this.s.findAll(); }
  @Get(':id') @RequirePermission('subscriptions.manage') findById(@Param('id') id: string) { return this.s.findById(id); }
  @Post() @RequirePermission('subscriptions.manage') create(@Body() d: any) { return this.s.create(d); }
  @Put(':id') @RequirePermission('subscriptions.manage') update(@Param('id') id: string, @Body() d: any) { return this.s.update(id, d); }
  @Delete(':id') @RequirePermission('subscriptions.manage') delete(@Param('id') id: string) { return this.s.delete(id); }
}