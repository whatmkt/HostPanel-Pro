import { Controller, Get, Post, Put, Delete, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/auth.module';
import { PermissionsGuard, RequirePermission } from '../../common/guards/permissions.guard';
@Controller('api/v1/email')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EmailController {
  constructor(private readonly s: EmailService) {}
  @Get() @RequirePermission('email.read') findAll() { return this.s.findAll(); }
  @Get(':id') @RequirePermission('email.read') findById(@Param('id') id: string) { return this.s.findById(id); }
  @Post() @RequirePermission('email.create') create(@Body() d: any) { return this.s.create(d); }
  @Put(':id') @RequirePermission('email.update') update(@Param('id') id: string, @Body() d: any) { return this.s.update(id, d); }
  @Delete(':id') @RequirePermission('email.delete') delete(@Param('id') id: string) { return this.s.delete(id); }
  @Post(':domainId/mailboxes') @RequirePermission('email.update') createMailbox(@Param('domainId') domainId: string, @Body() d: any) { return this.s.createMailbox(domainId, d); }
  @Put('mailboxes/:id') @RequirePermission('email.update') updateMailbox(@Param('id') id: string, @Body() d: any) { return this.s.updateMailbox(id, d); }
  @Delete('mailboxes/:id') @RequirePermission('email.delete') deleteMailbox(@Param('id') id: string) { return this.s.deleteMailbox(id); }
}