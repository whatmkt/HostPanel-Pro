'use client';
import { 
  Server, Cpu, HardDrive, MemoryStick, Globe, Database, Mail, 
  ShieldCheck, Cloud, AlertTriangle, TrendingUp, Activity,
  ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const cpuData = Array.from({ length: 24 }, (_, i) => ({
  time: i + ':00', value: Math.floor(Math.random() * 40 + 10)
}));
const memData = Array.from({ length: 24 }, (_, i) => ({
  time: i + ':00', value: Math.floor(Math.random() * 30 + 40)
}));

export default function DashboardPage() {
  const stats = [
    { label: 'Domains', value: '24', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Databases', value: '18', icon: Database, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Mailboxes', value: '45', icon: Mail, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'SSL Certs', value: '22', icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  const services = [
    { name: 'nginx', status: 'running' as const, cpu: '0.3%', mem: '12MB' },
    { name: 'PHP-FPM 8.2', status: 'running' as const, cpu: '1.2%', mem: '256MB' },
    { name: 'MariaDB', status: 'running' as const, cpu: '2.1%', mem: '512MB' },
    { name: 'PostgreSQL', status: 'running' as const, cpu: '0.8%', mem: '128MB' },
    { name: 'Redis', status: 'running' as const, cpu: '0.1%', mem: '64MB' },
    { name: 'Postfix', status: 'running' as const, cpu: '0.2%', mem: '45MB' },
    { name: 'Dovecot', status: 'running' as const, cpu: '0.1%', mem: '32MB' },
    { name: 'ClamAV', status: 'running' as const, cpu: '0.5%', mem: '198MB' },
    { name: 'Fail2Ban', status: 'running' as const, cpu: '0.0%', mem: '8MB' },
  ];

  const alerts = [
    { type: 'warning' as const, text: 'SSL certificate for example.com expires in 15 days' },
    { type: 'info' as const, text: '3 WordPress updates available for 2 sites' },
    { type: 'info' as const, text: 'Disk usage at 62% (498 GB free of 1.3 TB)' },
    { type: 'warning' as const, text: '5 failed login attempts from 203.0.113.45' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-title">Dashboard</h1>
        <p className="section-subtitle">Server overview and real-time monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">CPU Usage</span>
            <Cpu className="w-4 h-4 text-accent" />
          </div>
          <span className="stat-value">23%</span>
          <div className="w-full h-1.5 bg-panel-100 dark:bg-panel-700 rounded-full mt-2">
            <div className="h-full bg-accent rounded-full" style={{ width: '23%' }} />
          </div>
          <span className="stat-change-positive flex items-center gap-1"><ArrowDownRight className="w-3 h-3" /> 5% vs last hour</span>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Memory</span>
            <MemoryStick className="w-4 h-4 text-accent" />
          </div>
          <span className="stat-value">4.2 / 8 GB</span>
          <div className="w-full h-1.5 bg-panel-100 dark:bg-panel-700 rounded-full mt-2">
            <div className="h-full bg-warning rounded-full" style={{ width: '52%' }} />
          </div>
          <span className="stat-label">52% used</span>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Disk</span>
            <HardDrive className="w-4 h-4 text-accent" />
          </div>
          <span className="stat-value">812 / 1.3 TB</span>
          <div className="w-full h-1.5 bg-panel-100 dark:bg-panel-700 rounded-full mt-2">
            <div className="h-full bg-success rounded-full" style={{ width: '62%' }} />
          </div>
          <span className="change-info flex items-center gap-1">498 GB free</span>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Uptime</span>
            <Activity className="w-4 h-4 text-accent" />
          </div>
          <span className="stat-value">45d 12h</span>
          <span className="stat-change-positive flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> All services running</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className={'w-10 h-10 rounded-lg flex items-center justify-center ' + s.bg}>
              <s.icon className={'w-5 h-5 ' + s.color} />
            </div>
            <div>
              <p className="text-lg font-bold text-panel-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-panel-500 dark:text-panel-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <span>CPU Usage (24h)</span>
            <Cpu className="w-4 h-4 text-accent" />
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={cpuData}>
                <defs><linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" unit="%" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} fill="url(#cpuGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <span>Memory Usage (24h)</span>
            <MemoryStick className="w-4 h-4 text-accent" />
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={memData}>
                <defs><linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/><stop offset="95%" stopColor="#16a34a" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" unit="%" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} fill="url(#memGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <span>Services</span>
            <span className="badge-success">{services.filter(s => s.status === 'running').length}/{services.length} running</span>
          </div>
          <div className="card-body p-0">
            <div className="divide-y divide-panel-100 dark:divide-panel-700 max-h-[300px] overflow-y-auto">
              {services.map((svc) => (
                <div key={svc.name} className="flex items-center justify-between px-6 py-3 hover:bg-panel-50 dark:hover:bg-panel-700/30">
                  <div className="flex items-center gap-3">
                    <div className={'w-2 h-2 rounded-full ' + (svc.status === 'running' ? 'bg-success' : 'bg-danger')} />
                    <span className="text-sm font-medium text-panel-800 dark:text-panel-200">{svc.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-panel-500">
                    <span>CPU {svc.cpu}</span>
                    <span>RAM {svc.mem}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <div className="card-header flex items-center justify-between">
            <span>Recent Alerts</span>
            <AlertTriangle className="w-4 h-4 text-warning" />
          </div>
          <div className="card-body p-0">
            <div className="divide-y divide-panel-100 dark:divide-panel-700">
              {alerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-3 px-6 py-3 hover:bg-panel-50 dark:hover:bg-panel-700/30">
                  <div className={'w-2 h-2 mt-1.5 rounded-full shrink-0 ' + (alert.type === 'warning' ? 'bg-warning' : alert.type === 'danger' ? 'bg-danger' : 'bg-blue-500')} />
                  <p className="text-sm text-panel-700 dark:text-panel-300">{alert.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}