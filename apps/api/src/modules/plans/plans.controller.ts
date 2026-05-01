import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../auth/auth.module';
import { PermissionsGuard, RequirePermission } from '../../common/guards/permissions.guard';
@Controller('api/v1/plans')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PlansController {
  constructor(private readonly s: PlansService) {}
  @Get() @RequirePermission('plans.manage') findAll() { return this.s.findAll(); }
  @Get(':id') @RequirePermission('plans.manage') findById(@Param('id') id: string) { return this.s.findById(id); }
  @Post() @RequirePermission('plans.manage') create(@Body() d: any) { return this.s.create(d); }
  @Put(':id') @RequirePermission('plans.manage') update(@Param('id') id: string, @Body() d: any) { return this.s.update(id, d); }
  @Delete(':id') @RequirePermission('plans.manage') delete(@Param('id') id: string) { return this.s.delete(id); }
}