import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { SessionGuard } from '../auth/session.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermission } from '../../common/guards/permissions.guard';

@ApiTags('Audit')
@ApiBearerAuth()
@UseGuards(SessionGuard, PermissionsGuard)
@Controller('api/v1/audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @RequirePermission('viewLogs')
  findAll(@Query() query: any) {
    return this.auditService.findAll({ skip: +query.skip || 0, take: +query.take || 50, action: query.action, resource: query.resource, userId: query.userId });
  }
}