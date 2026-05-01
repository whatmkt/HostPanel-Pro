import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";

dotenvConfig({ path: resolve(__dirname, "../../../.env") });

export const getConfig = () => ({
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.API_PORT || "3001", 10),
  databaseUrl: process.env.DATABASE_URL || "postgresql://hostpanel:hostpanel@localhost:5432/hostpanel",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  encryptionKey: process.env.ENCRYPTION_KEY || "dev-encryption-key-32-chars-min!",
  agentUrl: process.env.AGENT_URL || "http://localhost:4000",
  agentSecret: process.env.AGENT_SECRET || "dev-agent-secret",
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  sessionSecret: process.env.SESSION_SECRET || "dev-session-secret-change-me",
  cookieDomain: process.env.COOKIE_DOMAIN || "",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  logLevel: process.env.LOG_LEVEL || "debug",
  backupPath: process.env.BACKUP_PATH || "/opt/hostpanel/backups",
  tempPath: process.env.TEMP_PATH || "/tmp/hostpanel",
  maxFileUploadSize: parseInt(process.env.MAX_FILE_UPLOAD_SIZE || "104857600", 10),
  otpIssuer: process.env.OTP_ISSUER || "HostPanel",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: parseInt(process.env.SMTP_PORT || "587", 10),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  smtpFrom: process.env.SMTP_FROM || "noreply@hostpanel.local",
});

export type AppConfig = ReturnType<typeof getConfig>;