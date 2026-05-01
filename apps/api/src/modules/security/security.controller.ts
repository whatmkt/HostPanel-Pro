import { Controller, Get, Post, Delete, Body, Param, Patch } from '@nestjs/common';
import { SecurityService } from './security.service';
import { RequirePermission } from '../../common/guards/permissions.guard';

@Controller('api/v1/security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('status')
  @RequirePermission('view_security')
  async getStatus() {
    return this.securityService.getStatus();
  }

  @Get('firewall')
  @RequirePermission('manage_firewall')
  async getFirewallRules() {
    return this.securityService.getFirewallRules();
  }

  @Post('firewall')
  @RequirePermission('manage_firewall')
  async addFirewallRule(@Body() data: any) {
    return this.securityService.addFirewallRule(data);
  }

  @Delete('firewall/:id')
  @RequirePermission('manage_firewall')
  async deleteFirewallRule(@Param('id') id: string) {
    return this.securityService.deleteFirewallRule(id);
  }

  @Get('fail2ban/jails')
  @RequirePermission('view_security')
  async getJails() {
    return this.securityService.getFail2BanJails();
  }

  @Patch('fail2ban/jails/:id')
  @RequirePermission('manage_firewall')
  async updateJail(@Param('id') id: string, @Body() data: any) {
    return this.securityService.updateJail(id, data);
  }

  @Post('fail2ban/unban/:id')
  @RequirePermission('manage_firewall')
  async unbanIp(@Param('id') id: string) {
    return this.securityService.unbanIp(id);
  }

  @Get('fail2ban/banned')
  @RequirePermission('view_security')
  async getBannedIps() {
    return this.securityService.getBannedIps();
  }
}
