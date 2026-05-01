import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DockerService } from './docker.service';
import { SessionGuard } from '../auth/session.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermission } from '../../common/guards/permissions.guard';

@ApiTags('Docker')
@ApiBearerAuth()
@UseGuards(SessionGuard, PermissionsGuard)
@Controller('api/v1/docker')
export class DockerController {
  constructor(private readonly dockerService: DockerService) {}

  @Get()
  @RequirePermission('manageDocker')
  findAll() { return this.dockerService.findAll(); }

  @Get(':id')
  @RequirePermission('manageDocker')
  findOne(@Param('id') id: string) { return this.dockerService.findOne(id); }

  @Post()
  @RequirePermission('manageDocker')
  create(@Body() data: any) { return this.dockerService.create(data); }

  @Put(':id')
  @RequirePermission('manageDocker')
  update(@Param('id') id: string, @Body() data: any) { return this.dockerService.update(id, data); }

  @Delete(':id')
  @RequirePermission('manageDocker')
  remove(@Param('id') id: string) { return this.dockerService.remove(id); }

  @Post(':id/start')
  @RequirePermission('manageDocker')
  start(@Param('id') id: string) { return this.dockerService.start(id); }

  @Post(':id/stop')
  @RequirePermission('manageDocker')
  stop(@Param('id') id: string) { return this.dockerService.stop(id); }

  @Post(':id/restart')
  @RequirePermission('manageDocker')
  restart(@Param('id') id: string) { return this.dockerService.restart(id); }
}