import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/auth.module';
import { PermissionsGuard, RequirePermission } from '../../common/guards/permissions.guard';

@Controller('api/v1/clients')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ClientsController {
  constructor(private readonly service: ClientsService) {}

  @Get() @RequirePermission('clients.manage') findAll() { return this.service.findAll(); }
  @Get(':id') @RequirePermission('clients.manage') findById(@Param('id') id: string) { return this.service.findById(id); }
  @Post() @RequirePermission('clients.manage') create(@Body() d: any) { return this.service.create(d); }
  @Put(':id') @RequirePermission('clients.manage') update(@Param('id') id: string, @Body() d: any) { return this.service.update(id, d); }
  @Delete(':id') @RequirePermission('clients.manage') delete(@Param('id') id: string) { return this.service.delete(id); }
}