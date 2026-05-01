import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { JwtAuthGuard } from '../auth/auth.module';
import { PermissionsGuard, RequirePermission } from '../../common/guards/permissions.guard';
@Controller('api/v1/databases')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DatabasesController {
  constructor(private readonly s: DatabasesService) {}
  @Get() @RequirePermission('databases.read') findAll() { return this.s.findAll(); }
  @Get(':id') @RequirePermission('databases.read') findById(@Param('id') id: string) { return this.s.findById(id); }
  @Post() @RequirePermission('databases.create') create(@Body() d: any) { return this.s.create(d); }
  @Put(':id') @RequirePermission('databases.update') update(@Param('id') id: string, @Body() d: any) { return this.s.update(id, d); }
  @Delete(':id') @RequirePermission('databases.delete') delete(@Param('id') id: string) { return this.s.delete(id); }
  @Post(':dbId/users') @RequirePermission('databases.update') createUser(@Param('dbId') dbId: string, @Body() d: any) { return this.s.createUser(dbId, d); }
  @Delete('users/:id') @RequirePermission('databases.delete') deleteUser(@Param('id') id: string) { return this.s.deleteUser(id); }
}