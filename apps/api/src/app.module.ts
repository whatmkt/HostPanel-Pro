import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { ClientsModule } from './modules/clients/clients.module';
import { PlansModule } from './modules/plans/plans.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { DomainsModule } from './modules/domains/domains.module';
import { SslModule } from './modules/ssl/ssl.module';
import { DnsModule } from './modules/dns/dns.module';
import { EmailModule } from './modules/email/email.module';
import { DatabasesModule } from './modules/databases/databases.module';
import { FilesModule } from './modules/files/files.module';
import { FtpModule } from './modules/ftp/ftp.module';
import { BackupsModule } from './modules/backups/backups.module';
import { SecurityModule } from './modules/security/security.module';
import { AntivirusModule } from './modules/antivirus/antivirus.module';
import { PerformanceModule } from './modules/performance/performance.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { LogsModule } from './modules/logs/logs.module';
import { CronModule } from './modules/cron/cron.module';
import { GitModule } from './modules/git/git.module';
import { DockerModule } from './modules/docker/docker.module';
import { WordPressModule } from './modules/wordpress/wordpress.module';
import { ExtensionsModule } from './modules/extensions/extensions.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AuditModule } from './modules/audit/audit.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HealthModule } from './modules/health/health.module';
import { QueueModule } from './queue/queue.module';
import { FirewallModule } from './modules/firewall/firewall.module';
import { Fail2banModule } from './modules/fail2ban/fail2ban.module';
import { UpdatesModule } from './modules/updates/updates.module';
import { ServerToolsModule } from './modules/server-tools/server-tools.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    QueueModule,
    AuthModule,
    UsersModule,
    RolesModule,
    ClientsModule,
    PlansModule,
    SubscriptionsModule,
    DomainsModule,
    SslModule,
    DnsModule,
    EmailModule,
    DatabasesModule,
    FilesModule,
    FtpModule,
    BackupsModule,
    SecurityModule,
    AntivirusModule,
    PerformanceModule,
    MonitoringModule,
    LogsModule,
    CronModule,
    GitModule,
    DockerModule,
    WordPressModule,
    ExtensionsModule,
    SettingsModule,
    AuditModule,
    NotificationsModule,
    DashboardModule,
    HealthModule,
    FirewallModule,
    Fail2banModule,
    UpdatesModule,
    ServerToolsModule,
  ],
})
export class AppModule {}
