import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { SessionGuard } from '../auth/session.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermission } from '../../common/guards/permissions.guard';

@Controller('api/v1/roles')
@UseGuards(SessionGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @RequirePermission('users.manage')
  findAll() { return this.rolesService.findAll(); }

  @Get(':id')
  @RequirePermission('users.manage')
  findById(@Param('id') id: string) { return this.rolesService.findById(id); }

  @Post()
  @RequirePermission('users.manage')
  create(@Body() data: { name: string; displayName: string; description?: string }) {
    return this.rolesService.create(data);
  }

  @Put(':id')
  @RequirePermission('users.manage')
  update(@Param('id') id: string, @Body() data: { displayName?: string; description?: string }) {
    return this.rolesService.update(id, data);
  }

  @Delete(':id')
  @RequirePermission('users.manage')
  delete(@Param('id') id: string) { return this.rolesService.delete(id); }

  @Post(':id/permissions/:permissionId')
  @RequirePermission('users.manage')
  assignPermission(@Param('id') id: string, @Param('permissionId') permissionId: string) {
    return this.rolesService.assignPermission(id, permissionId);
  }

  @Delete(':id/permissions/:permissionId')
  @RequirePermission('users.manage')
  removePermission(@Param('id') id: string, @Param('permissionId') permissionId: string) {
    return this.rolesService.removePermission(id, permissionId);
  }

  @Get('permissions/all')
  @RequirePermission('users.manage')
  getAllPermissions() { return this.rolesService.getAllPermissions(); }
}