import { Controller, Get, Post, Put, Delete, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { JwtAuthGuard } from '../auth/auth.module';
import { PermissionsGuard, RequirePermission } from '../../common/guards/permissions.guard';
@Controller('api/v1/domains')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DomainsController {
  constructor(private readonly s: DomainsService) {}
  @Get() @RequirePermission('domains.read') findAll() { return this.s.findAll(); }
  @Get(':id') @RequirePermission('domains.read') findById(@Param('id') id: string) { return this.s.findById(id); }
  @Post() @RequirePermission('domains.create') create(@Body() d: any) { return this.s.create(d); }
  @Put(':id') @RequirePermission('domains.update') update(@Param('id') id: string, @Body() d: any) { return this.s.update(id, d); }
  @Delete(':id') @RequirePermission('domains.delete') delete(@Param('id') id: string) { return this.s.delete(id); }
  @Patch(':id/suspend') @RequirePermission('domains.update') suspend(@Param('id') id: string) { return this.s.suspend(id); }
  @Patch(':id/activate') @RequirePermission('domains.update') activate(@Param('id') id: string) { return this.s.activate(id); }
}