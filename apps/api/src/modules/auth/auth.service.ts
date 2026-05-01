import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_MINUTES = 15;

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async registerFirstAdmin(data: { email: string; password: string; firstName: string; lastName?: string }) {
    const userCount = await this.prisma.user.count();
    if (userCount > 0) {
      throw new BadRequestException('Setup already completed');
    }

    const hashed = await bcrypt.hash(data.password, 12);

    const role = await this.prisma.role.create({
      data: {
        name: 'Super Administrator',
        slug: 'superadmin',
        description: 'Full system access',
        isSystem: true,
      },
    });

    const permissionDefs = [
      { name: 'Dashboard View', slug: 'dashboard.view', group: 'dashboard' },
      { name: 'Create Domain', slug: 'domains.create', group: 'domains' },
      { name: 'Edit Domain', slug: 'domains.edit', group: 'domains' },
      { name: 'Delete Domain', slug: 'domains.delete', group: 'domains' },
      { name: 'Manage DNS', slug: 'dns.manage', group: 'dns' },
      { name: 'Manage SSL', slug: 'ssl.manage', group: 'ssl' },
      { name: 'Manage Email', slug: 'mail.manage', group: 'mail' },
      { name: 'Manage Databases', slug: 'databases.manage', group: 'databases' },
      { name: 'Manage Files', slug: 'files.manage', group: 'files' },
      { name: 'Manage FTP', slug: 'ftp.manage', group: 'ftp' },
      { name: 'Manage Backups', slug: 'backups.manage', group: 'backups' },
      { name: 'Restore Backups', slug: 'backups.restore', group: 'backups' },
      { name: 'Manage Security', slug: 'security.manage', group: 'security' },
      { name: 'Manage Firewall', slug: 'firewall.manage', group: 'firewall' },
      { name: 'Manage Antivirus', slug: 'antivirus.manage', group: 'antivirus' },
      { name: 'Manage Performance', slug: 'performance.manage', group: 'performance' },
      { name: 'Manage Cache', slug: 'cache.manage', group: 'performance' },
      { name: 'Manage WordPress', slug: 'wordpress.manage', group: 'wordpress' },
      { name: 'View Logs', slug: 'logs.view', group: 'logs' },
      { name: 'Execute Cron', slug: 'cron.execute', group: 'cron' },
      { name: 'Manage Users', slug: 'users.manage', group: 'users' },
      { name: 'Manage Clients', slug: 'clients.manage', group: 'clients' },
      { name: 'Manage Server', slug: 'server.manage', group: 'server' },
      { name: 'Manage Extensions', slug: 'extensions.manage', group: 'extensions' },
    ];

    for (const def of permissionDefs) {
      const perm = await this.prisma.permission.create({
        data: { name: def.name, slug: def.slug, group: def.group },
      });
      await this.prisma.rolePermission.create({
        data: { roleId: role.id, permissionId: perm.id },
      });
    }

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.email,
        hashedPassword: hashed,
        firstName: data.firstName,
        lastName: data.lastName || '',
        roleId: role.id,
        isActive: true,
        isVerified: true,
      },
    });

    this.logger.log(`First admin created: ${data.email}`);
    return this.generateTokens(user.id, user.email);
  }

  async login(data: { email: string; password: string }, ip: string, userAgent: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!user) {
      await this.logAudit(null, 'login_failed', 'auth', { email: data.email, reason: 'user_not_found' }, ip, userAgent);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      await this.logAudit(user.id, 'login_blocked', 'auth', { reason: 'account_locked' }, ip, userAgent);
      throw new UnauthorizedException('Account temporarily locked. Try again later.');
    }

    const valid = await bcrypt.compare(data.password, user.hashedPassword);
    if (!valid) {
      const attempts = (user.failedLogins || 0) + 1;
      const update: any = { failedLogins: attempts };

      if (attempts >= this.MAX_LOGIN_ATTEMPTS) {
        update.lockedUntil = new Date(Date.now() + this.LOCKOUT_MINUTES * 60 * 1000);
      }

      await this.prisma.user.update({ where: { id: user.id }, data: update });
      await this.logAudit(user.id, 'login_failed', 'auth', { reason: 'invalid_password', attempt: attempts }, ip, userAgent);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLogins: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ip,
      },
    });

    const session = await this.prisma.userSession.create({
      data: {
        userId: user.id,
        token: uuid(),
        ipAddress: ip,
        userAgent,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    await this.logAudit(user.id, 'login_success', 'auth', {}, ip, userAgent);

    const tokens = await this.generateTokens(user.id, user.email);
    return { ...tokens, sessionId: session.id, user: this.sanitizeUser(user) };
  }

  async logout(sessionId: string) {
    await this.prisma.userSession.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }

  async validateSession(sessionId: string) {
    const session = await this.prisma.userSession.findUnique({ where: { id: sessionId } });
    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      return null;
    }
    return session;
  }

  async getUserWithPermissions(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    const valid = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!valid) throw new BadRequestException('Current password is incorrect');

    const newHashed = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedPassword: newHashed, passwordChangedAt: new Date() },
    });
  }

  async setup2FA(userId: string) {
    const { authenticator } = require('otplib');
    const secret = authenticator.generateSecret();
    await this.prisma.user.update({
      where: { id: userId },
      data: { totpSecret: secret, totpEnabled: false },
    });
    return { secret, uri: `otpauth://totp/HostPanel:${userId}?secret=${secret}&issuer=HostPanel` };
  }

  async verify2FA(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.totpSecret) throw new BadRequestException('2FA not set up');
    const { authenticator } = require('otplib');
    const valid = authenticator.check(token, user.totpSecret);
    if (!valid) throw new BadRequestException('Invalid 2FA code');
    await this.prisma.user.update({
      where: { id: userId },
      data: { totpEnabled: true },
    });
    return { success: true };
  }

  async disable2FA(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.totpSecret) throw new BadRequestException('2FA not enabled');
    const { authenticator } = require('otplib');
    const valid = authenticator.check(token, user.totpSecret);
    if (!valid) throw new BadRequestException('Invalid 2FA code');
    await this.prisma.user.update({
      where: { id: userId },
      data: { totpEnabled: false, totpSecret: null },
    });
    return { success: true };
  }

  private async generateTokens(userId: string, email: string) {
    const accessToken = this.jwt.sign({ sub: userId, email, type: 'access' }, { expiresIn: '1h' });
    const refreshToken = this.jwt.sign({ sub: userId, email, type: 'refresh' }, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { hashedPassword, totpSecret, ...safe } = user;
    return safe;
  }

  private async logAudit(
    userId: string | null,
    action: string,
    resourceType: string,
    details: any,
    ip: string,
    userAgent: string,
  ) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId,
          username: null,
          userEmail: null,
          action,
          resourceType,
          details: details || {},
          ipAddress: ip,
          userAgent,
          result: 'success',
        },
      });
    } catch (e) {
      this.logger.error('Failed to write audit log', e);
    }
  }
}