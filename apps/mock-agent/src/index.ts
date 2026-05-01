import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

app.use(cors());
app.use(express.json());

// Auth middleware mock
app.use((req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || token !== process.env.AGENT_TOKEN) {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid agent token' });
    return;
  }
  next();
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    agent: 'hostpanel-mock-agent',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// System metrics
app.get('/system/metrics', (_req: Request, res: Response) => {
  res.json({
    cpu: { usage: 12 + Math.random() * 15, cores: 8, model: 'Intel Xeon E-2288G @ 3.70GHz (mock)' },
    memory: { total: 34359738368, used: 8e9 + Math.random() * 1e10, free: 2.5e10 },
    disk: { total: 500e9, used: 45e9 + Math.random() * 20e9, free: 435e9, mount: '/' },
    load: { '1min': 0.5 + Math.random(), '5min': 0.7 + Math.random() * 0.5, '15min': 0.6 + Math.random() * 0.3 },
    uptime: Math.floor(Math.random() * 30 * 24 * 3600),
    network: { rx: Math.random() * 1e9, tx: Math.random() * 5e8 },
  });
});

// Services status
app.get('/system/services', (_req: Request, res: Response) => {
  res.json({
    services: [
      { name: 'nginx', status: 'active', enabled: true },
      { name: 'php8.2-fpm', status: 'active', enabled: true },
      { name: 'php8.3-fpm', status: 'active', enabled: true },
      { name: 'mariadb', status: 'active', enabled: true },
      { name: 'postgresql', status: 'inactive', enabled: false },
      { name: 'redis', status: 'active', enabled: true },
      { name: 'postfix', status: 'active', enabled: true },
      { name: 'dovecot', status: 'active', enabled: true },
      { name: 'fail2ban', status: 'active', enabled: true },
      { name: 'clamav-daemon', status: 'active', enabled: true },
    ],
  });
});

// Service control
app.post('/system/service/:name/:action', (req: Request, res: Response) => {
  const { name, action } = req.params;
  if (!['start', 'stop', 'restart', 'reload'].includes(action)) {
    res.status(400).json({ error: 'Invalid action' });
    return;
  }
  res.json({ status: 'ok', service: name, action, simulated: true });
});

// Domain operations
app.get('/websites', (_req: Request, res: Response) => {
  res.json({
    websites: [
      { domain: 'example.com', root: '/var/www/example.com', php: '8.3', ssl: true, status: 'active' },
      { domain: 'mysite.org', root: '/var/www/mysite.org', php: '8.2', ssl: true, status: 'active' },
    ],
  });
});

app.post('/websites', (req: Request, res: Response) => {
  res.json({ status: 'created', domain: req.body.domain, simulated: true });
});

app.delete('/websites/:domain', (req: Request, res: Response) => {
  res.json({ status: 'deleted', domain: req.params.domain, simulated: true });
});

// SSL
app.get('/ssl', (_req: Request, res: Response) => {
  res.json({
    certificates: [
      { domain: 'example.com', issuer: 'Lets Encrypt', expires: new Date(Date.now() + 60 * 24 * 3600000).toISOString(), autoRenew: true },
    ],
  });
});

app.post('/ssl/issue', (req: Request, res: Response) => {
  res.json({ status: 'issued', domain: req.body.domain, simulated: true });
});

// DNS
app.get('/dns/zones', (_req: Request, res: Response) => {
  res.json({
    zones: [
      { domain: 'example.com', records: 8, serial: 2024010101 },
    ],
  });
});

// Mail
app.get('/mail/domains', (_req: Request, res: Response) => {
  res.json({ domains: [{ domain: 'example.com', mailboxes: 3, aliases: 2 }] });
});

// Databases
app.get('/databases', (_req: Request, res: Response) => {
  res.json({
    databases: [
      { name: 'example_db', engine: 'mariadb', size: '12 MB', tables: 15, charset: 'utf8mb4' },
    ],
  });
});

// Files
app.get('/files', (req: Request, res: Response) => {
  const path = (req.query.path as string) || '/';
  res.json({
    path,
    items: [
      { name: 'public_html', type: 'directory', size: 4096, perms: '755', modified: new Date().toISOString() },
      { name: 'logs', type: 'directory', size: 4096, perms: '750', modified: new Date().toISOString() },
      { name: 'index.php', type: 'file', size: 418, perms: '644', modified: new Date().toISOString() },
      { name: '.htaccess', type: 'file', size: 237, perms: '644', modified: new Date().toISOString() },
    ],
  });
});

// Backups
app.get('/backups', (_req: Request, res: Response) => {
  res.json({
    backups: [
      { id: 'bkp-001', type: 'full', size: '245 MB', created: new Date(Date.now() - 86400000).toISOString(), status: 'completed' },
    ],
  });
});

// Firewall
app.get('/firewall/rules', (_req: Request, res: Response) => {
  res.json({
    rules: [
      { port: 22, protocol: 'tcp', action: 'allow', source: '0.0.0.0/0' },
      { port: 80, protocol: 'tcp', action: 'allow', source: '0.0.0.0/0' },
      { port: 443, protocol: 'tcp', action: 'allow', source: '0.0.0.0/0' },
    ],
  });
});

// Fail2Ban
app.get('/fail2ban/jails', (_req: Request, res: Response) => {
  res.json({ jails: [{ name: 'sshd', status: 'active', banned: 3 }, { name: 'nginx-http-auth', status: 'active', banned: 0 }] });
});

// Logs
app.get('/logs/:service', (req: Request, res: Response) => {
  const lines = Array.from({ length: 10 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
    level: i % 3 === 0 ? 'error' : 'info',
    message: `[mock] ${req.params.service} log entry #${i + 1}`,
  }));
  res.json({ service: req.params.service, lines, simulated: true });
});

// WordPress
app.get('/wordpress/sites', (_req: Request, res: Response) => {
  res.json({
    sites: [
      { domain: 'example.com', version: '6.5.3', plugins: 8, themes: 2, updates: 3, status: 'active' },
    ],
  });
});

// Docker
app.get('/docker/containers', (_req: Request, res: Response) => {
  res.json({
    containers: [
      { name: 'redis-cache', image: 'redis:7-alpine', status: 'running', ports: ['6379'] },
    ],
  });
});

// PHP versions
app.get('/php/versions', (_req: Request, res: Response) => {
  res.json({ versions: ['8.1', '8.2', '8.3'], default: '8.3' });
});

// Performance / cache
app.get('/performance/status', (_req: Request, res: Response) => {
  res.json({
    opcache: { enabled: true, hitRate: 94.2 },
    nginxCache: { enabled: false, size: 0 },
    redisCache: { enabled: true, keys: 1240, memory: '32 MB' },
    recommendations: ['Enable nginx FastCGI cache', 'Increase OPcache memory to 256MB'],
  });
});

// Cron
app.get('/cron/jobs', (_req: Request, res: Response) => {
  res.json({
    jobs: [{ id: 'cron-1', schedule: '0 3 * * *', command: '/usr/bin/php /var/www/example.com/cron.php', enabled: true, lastRun: new Date().toISOString() }],
  });
});

// Git deployments
app.get('/git/deployments', (_req: Request, res: Response) => {
  res.json({ deployments: [{ domain: 'example.com', repo: 'github.com/user/repo', branch: 'main', lastDeploy: new Date().toISOString() }] });
});

// Malware scanner
app.get('/security/malware/scan', (_req: Request, res: Response) => {
  res.json({ status: 'clean', filesScanned: 4520, threatsFound: 0, simulated: true });
});

// Notifications
app.get('/notifications', (_req: Request, res: Response) => {
  res.json({
    notifications: [
      { id: 'n-1', type: 'warning', message: 'SSL certificate expires in 25 days', timestamp: new Date().toISOString() },
      { id: 'n-2', type: 'info', message: 'Backup completed successfully', timestamp: new Date().toISOString() },
    ],
  });
});

// Package updates
app.get('/system/updates', (_req: Request, res: Response) => {
  res.json({ security: 3, regular: 12, panel: { current: '1.0.0', latest: '1.0.0' } });
});

app.listen(PORT, () => {
  console.log(`🔧 HostPanel Pro Mock Agent running on port ${PORT}`);
  console.log(`   Mode: Mock (Phase 1 - Simulated responses)`);
  console.log(`   No real system actions performed`);
});