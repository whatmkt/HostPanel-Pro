import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/auth.module';
import { PermissionsGuard, RequirePermission } from '../../common/guards/permissions.guard';

@Controller('api/v1/users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermission('users.manage')
  findAll() { return this.usersService.findAll(); }

  @Get(':id')
  @RequirePermission('users.manage')
  findById(@Param('id') id: string) { return this.usersService.findById(id); }

  @Post()
  @RequirePermission('users.manage')
  create(@Body() data: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    roleId: string;
    clientId?: string;
  }) {
    return this.usersService.create(data);
  }

  @Put(':id')
  @RequirePermission('users.manage')
  update(@Param('id') id: string, @Body() data: {
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    roleId?: string;
    clientId?: string;
    isActive?: boolean;
    phone?: string;
  }) {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @RequirePermission('users.manage')
  delete(@Param('id') id: string) { return this.usersService.delete(id); }

  @Post(':id/password')
  @RequirePermission('users.manage')
  changePassword(@Param('id') id: string, @Body('password') password: string) {
    return this.usersService.changePassword(id, password);
  }

  @Post(':id/2fa')
  @RequirePermission('users.manage')
  toggle2FA(@Param('id') id: string, @Body('enabled') enabled: boolean) {
    return this.usersService.toggle2FA(id, enabled);
  }

  @Get(':id/sessions')
  @RequirePermission('users.manage')
  getSessions(@Param('id') id: string) { return this.usersService.getSessions(id); }

  @Delete(':id/sessions/:sessionId')
  @RequirePermission('users.manage')
  revokeSession(@Param('sessionId') sessionId: string) { return this.usersService.revokeSession(sessionId); }
}