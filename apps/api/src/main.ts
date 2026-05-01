import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('HostPanel Pro API')
    .setDescription('Professional Web Hosting Control Panel REST API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addCookieAuth('session_token')
    .addTag('auth', 'Authentication')
    .addTag('users', 'User Management')
    .addTag('roles', 'Role Management')
    .addTag('clients', 'Client Management')
    .addTag('plans', 'Hosting Plans')
    .addTag('subscriptions', 'Subscriptions')
    .addTag('domains', 'Domains & Websites')
    .addTag('ssl', 'SSL/TLS Certificates')
    .addTag('dns', 'DNS Management')
    .addTag('mail', 'Mail Management')
    .addTag('databases', 'Database Management')
    .addTag('files', 'File Manager')
    .addTag('ftp', 'FTP Accounts')
    .addTag('backups', 'Backup Management')
    .addTag('security', 'Security & Firewall')
    .addTag('antivirus', 'Antivirus & Malware')
    .addTag('performance', 'Performance & Cache')
    .addTag('monitoring', 'System Monitoring')
    .addTag('logs', 'Log Viewer')
    .addTag('cron', 'Scheduled Tasks')
    .addTag('git', 'Git Deployments')
    .addTag('docker', 'Docker Management')
    .addTag('wordpress', 'WordPress Toolkit')
    .addTag('extensions', 'Extensions')
    .addTag('settings', 'Panel Settings')
    .addTag('audit', 'Audit Log')
    .addTag('notifications', 'Notifications')
    .addTag('dashboard', 'Dashboard')
    .addTag('health', 'Health Check')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'HostPanel Pro API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.API_PORT || 3001;
  await app.listen(port);
  logger.log(`API running on http://0.0.0.0:${port}`);
  logger.log(`Swagger docs at http://0.0.0.0:${port}/api/docs`);
}

bootstrap();