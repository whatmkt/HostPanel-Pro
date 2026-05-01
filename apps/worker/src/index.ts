import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';

const connection = new Redis(REDIS_URL, { maxRetriesPerRequest: null });

// Queue names
export const QUEUES = {
  SYSTEM: 'system',
  DOMAIN: 'domain',
  SSL: 'ssl',
  BACKUP: 'backup',
  SECURITY: 'security',
  MAIL: 'mail',
  NOTIFICATION: 'notification',
  AUDIT: 'audit',
  DEPLOYMENT: 'deployment',
  CLEANUP: 'cleanup',
} as const;

// --- System Queue ---
const systemQueue = new Queue(QUEUES.SYSTEM, { connection });
const systemWorker = new Worker(
  QUEUES.SYSTEM,
  async (job: Job) => {
    console.log(`[Worker] Processing system job: ${job.name}`, job.data);
    switch (job.name) {
      case 'health-check':
        return { status: 'healthy', services: mockHealthCheck() };
      case 'update-system':
        return { status: 'simulated', message: 'System update queued (mock)' };
      default:
        return { status: 'unknown-job', name: job.name };
    }
  },
  { connection }
);

// --- Domain Queue ---
const domainQueue = new Queue(QUEUES.DOMAIN, { connection });
const domainWorker = new Worker(
  QUEUES.DOMAIN,
  async (job: Job) => {
    console.log(`[Worker] Processing domain job: ${job.name}`, job.data);
    await simulateWork(200);
    return { status: 'completed', job: job.name, simulated: true };
  },
  { connection }
);

// --- SSL Queue ---
const sslQueue = new Queue(QUEUES.SSL, { connection });
const sslWorker = new Worker(
  QUEUES.SSL,
  async (job: Job) => {
    console.log(`[Worker] Processing SSL job: ${job.name}`, job.data);
    await simulateWork(500);
    return { status: 'completed', job: job.name, simulated: true };
  },
  { connection }
);

// --- Backup Queue ---
const backupQueue = new Queue(QUEUES.BACKUP, { connection });
const backupWorker = new Worker(
  QUEUES.BACKUP,
  async (job: Job) => {
    console.log(`[Worker] Processing backup job: ${job.name}`, job.data);
    await simulateWork(1000);
    return { status: 'completed', job: job.name, simulated: true, size: '0 MB' };
  },
  { connection }
);

// --- Security Queue ---
const securityQueue = new Queue(QUEUES.SECURITY, { connection });
const securityWorker = new Worker(
  QUEUES.SECURITY,
  async (job: Job) => {
    console.log(`[Worker] Processing security job: ${job.name}`, job.data);
    await simulateWork(800);
    return { status: 'completed', job: job.name, simulated: true, threatsFound: 0 };
  },
  { connection }
);

// --- Mail Queue ---
const mailQueue = new Queue(QUEUES.MAIL, { connection });
const mailWorker = new Worker(
  QUEUES.MAIL,
  async (job: Job) => {
    console.log(`[Worker] Processing mail job: ${job.name}`, job.data);
    await simulateWork(300);
    return { status: 'completed', job: job.name, simulated: true };
  },
  { connection }
);

// --- Notification Queue ---
const notificationQueue = new Queue(QUEUES.NOTIFICATION, { connection });
const notificationWorker = new Worker(
  QUEUES.NOTIFICATION,
  async (job: Job) => {
    console.log(`[Worker] Processing notification: ${job.name}`, job.data);
    await simulateWork(100);
    return { status: 'sent', job: job.name, simulated: true };
  },
  { connection }
);

// --- Audit Queue ---
const auditQueue = new Queue(QUEUES.AUDIT, { connection });
const auditWorker = new Worker(
  QUEUES.AUDIT,
  async (job: Job) => {
    console.log(`[Worker] Recording audit: ${job.name}`, job.data);
    return { status: 'recorded', job: job.name };
  },
  { connection }
);

// --- Deployment Queue ---
const deploymentQueue = new Queue(QUEUES.DEPLOYMENT, { connection });
const deploymentWorker = new Worker(
  QUEUES.DEPLOYMENT,
  async (job: Job) => {
    console.log(`[Worker] Processing deployment: ${job.name}`, job.data);
    await simulateWork(1500);
    return { status: 'completed', job: job.name, simulated: true };
  },
  { connection }
);

// --- Cleanup Queue ---
const cleanupQueue = new Queue(QUEUES.CLEANUP, { connection });
const cleanupWorker = new Worker(
  QUEUES.CLEANUP,
  async (job: Job) => {
    console.log(`[Worker] Running cleanup: ${job.name}`, job.data);
    await simulateWork(600);
    return { status: 'completed', job: job.name, simulated: true };
  },
  { connection }
);

// --- Helpers ---

function mockHealthCheck() {
  return {
    cpu: Math.floor(Math.random() * 30 + 10),
    memory: Math.floor(Math.random() * 40 + 20),
    disk: Math.floor(Math.random() * 20 + 10),
    load: (Math.random() * 2).toFixed(2),
    uptime: Math.floor(Math.random() * 30 * 24 * 3600),
  };
}

function simulateWork(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Worker event handlers
const workers = [
  systemWorker, domainWorker, sslWorker, backupWorker,
  securityWorker, mailWorker, notificationWorker, auditWorker,
  deploymentWorker, cleanupWorker,
];

workers.forEach((worker, i) => {
  worker.on('completed', (job) => {
    console.log(`[Worker ${i}] Job ${job.id} completed: ${job.name}`);
  });
  worker.on('failed', (job, err) => {
    console.error(`[Worker ${i}] Job ${job?.id} failed: ${job?.name}`, err);
  });
});

console.log('🚀 HostPanel Pro Worker started');
console.log(`   Redis: ${REDIS_URL}`);
console.log('   Queues: System | Domain | SSL | Backup | Security | Mail | Notification | Audit | Deployment | Cleanup');
console.log('   Mode: Mock (Phase 1)');

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down worker...');
  await Promise.all(workers.map((w) => w.close()));
  await connection.quit();
  process.exit(0);
});