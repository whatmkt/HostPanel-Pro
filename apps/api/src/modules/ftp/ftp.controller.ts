import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { FtpService } from './ftp.service';
import { JwtAuthGuard } from '../auth/auth.module';
import { PermissionsGuard, RequirePermission } from '../../common/guards/permissions.guard';
@Controller('api/v1/ftp')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FtpController {
  constructor(private readonly s: FtpService) {}
  @Get() @RequirePermission('ftp.read') findAll() { return this.s.findAll(); }
  @Get(':id') @RequirePermission('ftp.read') findById(@Param('id') id: string) { return this.s.findById(id); }
  @Post() @RequirePermission('ftp.create') create(@Body() d: any) { return this.s.create(d); }
  @Put(':id') @RequirePermission('ftp.update') update(@Param('id') id: string, @Body() d: any) { return this.s.update(id, d); }
  @Delete(':id') @RequirePermission('ftp.delete') delete(@Param('id') id: string) { return this.s.delete(id); }
}