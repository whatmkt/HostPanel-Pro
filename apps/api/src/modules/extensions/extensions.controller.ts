import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ExtensionsService } from './extensions.service';
import { SessionGuard } from '../auth/session.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermission } from '../../common/guards/permissions.guard';

@ApiTags('Extensions')
@ApiBearerAuth()
@UseGuards(SessionGuard, PermissionsGuard)
@Controller('api/v1/extensions')
export class ExtensionsController {
  constructor(private readonly extensionsService: ExtensionsService) {}

  @Get()
  @RequirePermission('manageExtensions')
  findAll() { return this.extensionsService.findAll(); }

  @Get(':id')
  @RequirePermission('manageExtensions')
  findOne(@Param('id') id: string) { return this.extensionsService.findOne(id); }

  @Post()
  @RequirePermission('manageExtensions')
  install(@Body() data: any) { return this.extensionsService.install(data); }

  @Put(':id/activate')
  @RequirePermission('manageExtensions')
  activate(@Param('id') id: string) { return this.extensionsService.activate(id); }

  @Put(':id/deactivate')
  @RequirePermission('manageExtensions')
  deactivate(@Param('id') id: string) { return this.extensionsService.deactivate(id); }

  @Delete(':id')
  @RequirePermission('manageExtensions')
  remove(@Param('id') id: string) { return this.extensionsService.remove(id); }
}