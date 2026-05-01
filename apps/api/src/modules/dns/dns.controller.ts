import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { DnsService } from './dns.service';
import { JwtAuthGuard } from '../auth/auth.module';
import { PermissionsGuard, RequirePermission } from '../../common/guards/permissions.guard';
@Controller('api/v1/dns')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DnsController {
  constructor(private readonly s: DnsService) {}
  @Get() @RequirePermission('dns.read') findAll() { return this.s.findAll(); }
  @Get(':id') @RequirePermission('dns.read') findById(@Param('id') id: string) { return this.s.findById(id); }
  @Post() @RequirePermission('dns.create') create(@Body() d: any) { return this.s.create(d); }
  @Put(':id') @RequirePermission('dns.update') update(@Param('id') id: string, @Body() d: any) { return this.s.update(id, d); }
  @Delete(':id') @RequirePermission('dns.delete') delete(@Param('id') id: string) { return this.s.delete(id); }
  @Post(':zoneId/records') @RequirePermission('dns.update') createRecord(@Param('zoneId') zoneId: string, @Body() d: any) { return this.s.createRecord(zoneId, d); }
  @Put('records/:id') @RequirePermission('dns.update') updateRecord(@Param('id') id: string, @Body() d: any) { return this.s.updateRecord(id, d); }
  @Delete('records/:id') @RequirePermission('dns.update') deleteRecord(@Param('id') id: string) { return this.s.deleteRecord(id); }
}