import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/auth.module';
import { PermissionsGuard, RequirePermission } from '../../common/guards/permissions.guard';
@Controller('api/v1/files')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FilesController {
  constructor(private readonly s: FilesService) {}
  @Get(':domainId/tree') @RequirePermission('files.read') getTree(@Param('domainId') domainId: string, @Query('path') path: string) { return this.s.getTree(domainId, path || '/'); }
  @Get(':domainId/read') @RequirePermission('files.read') readFile(@Param('domainId') domainId: string, @Query('path') path: string) { return this.s.readFile(domainId, path); }
  @Post(':domainId/write') @RequirePermission('files.write') writeFile(@Param('domainId') domainId: string, @Body() d: any) { return this.s.writeFile(domainId, d.path, d.content); }
  @Delete(':domainId/delete') @RequirePermission('files.delete') deleteFile(@Param('domainId') domainId: string, @Query('path') path: string) { return this.s.deleteFile(domainId, path); }
  @Post(':domainId/mkdir') @RequirePermission('files.write') mkdir(@Param('domainId') domainId: string, @Body() d: any) { return this.s.createDirectory(domainId, d.path); }
  @Put(':domainId/rename') @RequirePermission('files.write') rename(@Param('domainId') domainId: string, @Body() d: any) { return this.s.rename(domainId, d.oldPath, d.newPath); }
  @Post(':domainId/copy') @RequirePermission('files.write') copy(@Param('domainId') domainId: string, @Body() d: any) { return this.s.copy(domainId, d.src, d.dest); }
  @Post(':domainId/move') @RequirePermission('files.write') move(@Param('domainId') domainId: string, @Body() d: any) { return this.s.move(domainId, d.src, d.dest); }
  @Post(':domainId/compress') @RequirePermission('files.write') compress(@Param('domainId') domainId: string, @Body() d: any) { return this.s.compress(domainId, d.path, d.format); }
  @Post(':domainId/extract') @RequirePermission('files.write') extract(@Param('domainId') domainId: string, @Body() d: any) { return this.s.extract(domainId, d.archivePath); }
  @Put(':domainId/chmod') @RequirePermission('files.write') chmod(@Param('domainId') domainId: string, @Body() d: any) { return this.s.chmod(domainId, d.path, d.mode); }
  @Get(':domainId/search') @RequirePermission('files.read') search(@Param('domainId') domainId: string, @Query('q') q: string) { return this.s.search(domainId, q); }
}