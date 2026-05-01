import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { GitService } from './git.service';
import { JwtAuthGuard } from '../auth/auth.module';
import { PermissionsGuard, RequirePermission } from '../../common/guards/permissions.guard';

@Controller('api/v1/git')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GitController {
  constructor(private readonly service: GitService) {}
  @Get() @RequirePermission('git.view') findAll() { return this.service.findAll(); }
  @Post() @RequirePermission('git.create') create(@Body() dto: any) { return this.service.create(dto); }
  @Put(':id') @RequirePermission('git.edit') update(@Param('id') id: string, @Body() dto: any) { return this.service.update(id, dto); }
  @Delete(':id') @RequirePermission('git.delete') remove(@Param('id') id: string) { return this.service.remove(id); }
  @Post(':id/deploy') @RequirePermission('git.deploy') deploy(@Param('id') id: string) { return this.service.deploy(id); }
  @Post(':id/rollback') @RequirePermission('git.deploy') rollback(@Param('id') id: string) { return this.service.rollback(id); }
}
