import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      include: { role: true, client: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        client: true,
        sessions: true,
        auditLogs: true,
        notifications: true,
        apiTokens: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    roleId: string;
    clientId?: string;
  }) {
    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { username: data.username }] },
    });
    if (exists) {
      if (exists.email === data.email) throw new ConflictException('Email already in use');
      throw new ConflictException('Username already in use');
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    return this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        hashedPassword,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        roleId: data.roleId,
        clientId: data.clientId || null,
        isVerified: true,
      },
      include: { role: true, client: true },
    });
  }

  async update(
    id: string,
    data: {
      email?: string;
      username?: string;
      firstName?: string;
      lastName?: string;
      roleId?: string;
      clientId?: string;
      isActive?: boolean;
      phone?: string;
    },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (data.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
      if (existing && existing.id !== id) throw new ConflictException('Email already in use');
    }
    if (data.username) {
      const existing = await this.prisma.user.findUnique({ where: { username: data.username } });
      if (existing && existing.id !== id) throw new ConflictException('Username already in use');
    }

    return this.prisma.user.update({
      where: { id },
      data,
      include: { role: true, client: true },
    });
  }

  async delete(id: string) {
    await this.prisma.user.findUniqueOrThrow({ where: { id } });
    return this.prisma.user.delete({ where: { id } });
  }

  async changePassword(id: string, newPassword: string) {
    const hashed = await bcrypt.hash(newPassword, 12);
    return this.prisma.user.update({
      where: { id },
      data: { hashedPassword: hashed, passwordChangedAt: new Date() },
    });
  }

  async toggle2FA(id: string, enabled: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { totpEnabled: enabled },
    });
  }

  async getSessions(userId: string) {
    return this.prisma.userSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revokeSession(sessionId: string) {
    return this.prisma.userSession.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
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

  async count() {
    return this.prisma.user.count();
  }
}