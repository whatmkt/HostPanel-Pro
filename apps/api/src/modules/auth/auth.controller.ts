import { Controller, Post, Get, Delete, Body, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SessionGuard } from './session.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('setup')
  @ApiOperation({ summary: 'Register first superadmin (initial setup)' })
  async setup(@Body() dto: { email: string; password: string; name: string }) {
    return this.auth.registerFirstAdmin(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  async login(
    @Body() dto: { email: string; password: string },
    @Req() req: any,
  ) {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    return this.auth.login(dto, ip, userAgent);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionGuard)
  @ApiOperation({ summary: 'User logout' })
  async logout(@Body() dto: { sessionId: string }) {
    await this.auth.logout(dto.sessionId);
    return { success: true };
  }

  @Get('me')
  @UseGuards(SessionGuard)
  @ApiOperation({ summary: 'Get current user' })
  async me(@Req() req: any) {
    const user = await this.auth.getUserWithPermissions(req.user.id);
    if (!user) throw new Error('User not found');
    const { passwordHash, totpSecret, ...safe } = user as any;
    return safe;
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionGuard)
  @ApiOperation({ summary: 'Change password' })
  async changePassword(
    @Req() req: any,
    @Body() dto: { currentPassword: string; newPassword: string },
  ) {
    await this.auth.changePassword(req.user.id, dto.currentPassword, dto.newPassword);
    return { success: true };
  }

  @Post('2fa/setup')
  @UseGuards(SessionGuard)
  @ApiOperation({ summary: 'Setup 2FA' })
  async setup2FA(@Req() req: any) {
    return this.auth.setup2FA(req.user.id);
  }

  @Post('2fa/verify')
  @UseGuards(SessionGuard)
  @ApiOperation({ summary: 'Verify 2FA code' })
  async verify2FA(@Req() req: any, @Body() dto: { token: string }) {
    return this.auth.verify2FA(req.user.id, dto.token);
  }

  @Get('sessions')
  @UseGuards(SessionGuard)
  @ApiOperation({ summary: 'List active sessions' })
  async sessions(@Req() req: any) {
    return req.user.sessions || [];
  }
}