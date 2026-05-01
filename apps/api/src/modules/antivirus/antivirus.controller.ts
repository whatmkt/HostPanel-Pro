import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { AntivirusService } from './antivirus.service';

@Controller('api/v1/antivirus')
export class AntivirusController {
  constructor(private readonly antivirusService: AntivirusService) {}

  @Get('status')
  async getStatus() {
    return this.antivirusService.getStatus();
  }

  @Get('scans')
  async getScans() {
    return this.antivirusService.getScans();
  }

  @Post('scan')
  async startScan(@Body() data: { domainId?: string }) {
    return this.antivirusService.startScan(data.domainId);
  }

  @Get('scans/:scanId/findings')
  async getFindings(@Param('scanId') scanId: string) {
    return this.antivirusService.getFindings(scanId);
  }

  @Post('findings/:id/quarantine')
  async quarantineFile(@Param('id') id: string) {
    return this.antivirusService.quarantineFile(id);
  }

  @Post('findings/:id/restore')
  async restoreFile(@Param('id') id: string) {
    return this.antivirusService.restoreFile(id);
  }

  @Delete('findings/:id')
  async deleteMalware(@Param('id') id: string) {
    return this.antivirusService.deleteMalware(id);
  }
}