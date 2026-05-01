import { Controller, Get, Post, Put, Delete, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { SslService } from './ssl.service';
import { JwtAuthGuard } from '../auth/auth.module';
import { PermissionsGuard, RequirePermission } from '../../common/guards/permissions.guard';
@Controller('api/v1/ssl')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SslController {
  constructor(private readonly s: SslService) {}
  @Get() @RequirePermission('ssl.read') findAll() { return this.s.findAll(); }
  @Get(':id') @RequirePermission('ssl.read') findById(@Param('id') id: string) { return this.s.findById(id); }
  @Post() @RequirePermission('ssl.create') create(@Body() d: any) { return this.s.create(d); }
  @Put(':id') @RequirePermission('ssl.update') update(@Param('id') id: string, @Body() d: any) { return this.s.update(id, d); }
  @Delete(':id') @RequirePermission('ssl.delete') delete(@Param('id') id: string) { return this.s.delete(id); }
  @Patch(':id/issue') @RequirePermission('ssl.manage') issue(@Param('id') id: string) { return this.s.issue(id); }
  @Patch(':id/revoke') @RequirePermission('ssl.manage') revoke(@Param('id') id: string) { return this.s.revoke(id); }
}