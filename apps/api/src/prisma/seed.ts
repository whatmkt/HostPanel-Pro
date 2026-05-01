import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding HostPanel database...');

  // Roles
  const superadminRole = await prisma.role.upsert({
    where: { slug: 'superadmin' },
    update: {},
    create: {
      name: 'Super Administrator',
      slug: 'superadmin',
      description: 'Full system access',
      isSystem: true,
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { slug: 'admin' },
    update: {},
    create: {
      name: 'Administrator',
      slug: 'admin',
      description: 'Server administrator',
      isSystem: true,
    },
  });

  const resellerRole = await prisma.role.upsert({
    where: { slug: 'reseller' },
    update: {},
    create: {
      name: 'Reseller',
      slug: 'reseller',
      description: 'Can manage clients and sell plans',
      isSystem: true,
    },
  });

  const clientRole = await prisma.role.upsert({
    where: { slug: 'client' },
    update: {},
    create: {
      name: 'Client',
      slug: 'client',
      description: 'End customer',
      isSystem: true,
    },
  });

  const readonlyRole = await prisma.role.upsert({
    where: { slug: 'readonly' },
    update: {},
    create: {
      name: 'Read Only',
      slug: 'readonly',
      description: 'Can view but not modify',
      isSystem: true,
    },
  });

  // Permissions
  const permissionDefinitions: Array<{ name: string; slug: string; group: string }> = [
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

  const permissions: Record<string, any> = {};
  for (const def of permissionDefinitions) {
    const perm = await prisma.permission.upsert({
      where: { slug: def.slug },
      update: {},
      create: { name: def.name, slug: def.slug, group: def.group },
    });
    permissions[def.slug] = perm;
  }

  // Assign all permissions to superadmin
  for (const [, perm] of Object.entries(permissions)) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superadminRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: superadminRole.id, permissionId: perm.id },
    });
  }

  // Create superadmin user (password: admin123456)
  const hashedPassword = await bcrypt.hash('admin123456', 12);
  const superadmin = await prisma.user.upsert({
    where: { email: 'admin@hostpanel.local' },
    update: {},
    create: {
      email: 'admin@hostpanel.local',
      username: 'admin',
      hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      roleId: superadminRole.id,
      isActive: true,
      isVerified: true,
    },
  });

  // Create demo client
  const demoClient = await prisma.client.upsert({
    where: { email: 'demo@hostpanel.local' },
    update: {},
    create: {
      email: 'demo@hostpanel.local',
      companyName: 'Demo Company',
      firstName: 'Demo',
      lastName: 'Client',
      isActive: true,
    },
  });

  // Hosting plans
  const plans = [
    { name: 'Starter', slug: 'starter', description: 'Entry-level hosting', price: 4.99, diskLimitMb: 5120, bandwidthMb: 51200, dbLimit: 2, mailboxLimit: 5, ftpLimit: 2, domainLimit: 1, subdomainLimit: 3, isActive: true, sortOrder: 1 },
    { name: 'Business', slug: 'business', description: 'Growing businesses', price: 14.99, diskLimitMb: 20480, bandwidthMb: 204800, dbLimit: 10, mailboxLimit: 50, ftpLimit: 10, domainLimit: 5, subdomainLimit: 20, isActive: true, sortOrder: 2 },
    { name: 'Enterprise', slug: 'enterprise', description: 'High-traffic sites', price: 49.99, diskLimitMb: 102400, bandwidthMb: 1024000, dbLimit: 50, mailboxLimit: 200, ftpLimit: 50, domainLimit: 20, subdomainLimit: 100, isActive: true, sortOrder: 3 },
  ];

  for (const plan of plans) {
    await prisma.hostingPlan.upsert({
      where: { slug: plan.slug },
      update: {},
      create: plan,
    });
  }

  // Demo domain
  await prisma.domain.upsert({
    where: { domainName: 'demo.hostpanel.local' },
    update: {},
    create: {
      domainName: 'demo.hostpanel.local',
      documentRoot: '/var/www/demo.hostpanel.local',
      status: 'active',
      phpVersion: '8.2',
      webServer: 'nginx',
      redirectHttps: true,
      isActive: true,
      clientId: demoClient.id,
    },
  });

  // Settings (label is required)
  const settings = [
    { key: 'panel_name', value: 'HostPanel Pro', label: 'Panel Name' },
    { key: 'panel_version', value: '1.0.0', label: 'Panel Version' },
    { key: 'default_php_version', value: '8.2', label: 'Default PHP Version' },
    { key: 'default_webserver', value: 'nginx', label: 'Default Web Server' },
    { key: 'backup_retention_days', value: '30', label: 'Backup Retention Days' },
    { key: 'max_login_attempts', value: '5', label: 'Max Login Attempts', group: 'security' },
    { key: 'lockout_minutes', value: '15', label: 'Lockout Minutes', group: 'security' },
    { key: 'session_timeout_hours', value: '24', label: 'Session Timeout Hours', group: 'security' },
    { key: 'require_2fa_admin', value: 'false', label: 'Require 2FA for Admins', group: 'security' },
    { key: 'auto_update_security', value: 'true', label: 'Auto Update Security', group: 'updates' },
    { key: 'notifications_enabled', value: 'true', label: 'Notifications Enabled', group: 'notifications' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  // Notifications
  await prisma.notification.createMany({
    skipDuplicates: true,
    data: [
      { type: 'info', severity: 'info', title: 'Welcome to HostPanel Pro', message: 'Your hosting panel has been successfully installed.', userId: superadmin.id },
      { type: 'tip', severity: 'info', title: 'Security recommendation', message: 'Enable 2FA for your admin account to enhance security.', userId: superadmin.id },
      { type: 'tip', severity: 'info', title: 'Backup recommendation', message: 'Configure automatic backups to protect your data.', userId: superadmin.id },
    ],
  });

  console.log('Seed completed successfully!');
  console.log(`Superadmin: admin@hostpanel.local / admin123456`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });