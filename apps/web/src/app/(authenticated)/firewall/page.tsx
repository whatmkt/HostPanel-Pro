'use client';
import { useState } from 'react';
import PageShell from '@/components/PageShell';
import { ShieldCheck, Shield, Plus, Trash2, Edit3, Power, PowerOff, Search, Globe, Mail as MailIcon, Server, Database, HardDrive, Wifi } from 'lucide-react';
import { toast } from 'sonner';

function Badge({ variant, children }: { variant: 'success' | 'warning' | 'danger' | 'info'; children: React.ReactNode }) {
  const colors = {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colors[variant]}`}>{children}</span>;
}

export default function FirewallPage() {
  const [tab, setTab] = useState<'firewall' | 'fail2ban'>('firewall');

  const fwRules = [
    { id: 1, type: 'allow', port: '22', protocol: 'tcp', source: '10.0.0.0/8', description: 'SSH internal network', service: 'ssh' },
    { id: 2, type: 'allow', port: '80', protocol: 'tcp', source: 'any', description: 'HTTP', service: 'http' },
    { id: 3, type: 'allow', port: '443', protocol: 'tcp', source: 'any', description: 'HTTPS', service: 'https' },
    { id: 4, type: 'allow', port: '3000', protocol: 'tcp', source: 'any', description: 'HostPanel Pro Panel', service: 'panel' },
    { id: 5, type: 'allow', port: '25', protocol: 'tcp', source: 'any', description: 'SMTP', service: 'smtp' },
    { id: 6, type: 'allow', port: '993', protocol: 'tcp', source: 'any', description: 'IMAPS', service: 'imaps' },
    { id: 7, type: 'allow', port: '3306', protocol: 'tcp', source: '10.0.0.0/8', description: 'MySQL internal', service: 'mysql' },
    { id: 8, type: 'deny', port: '23', protocol: 'tcp', source: 'any', description: 'Telnet blocked', service: 'custom' },
  ];

  const f2bJails = [
    { name: 'sshd', enabled: true, bans: 12, findTime: '10m', maxRetry: 5 },
    { name: 'hostpanel', enabled: true, bans: 3, findTime: '10m', maxRetry: 5 },
    { name: 'nginx-http-auth', enabled: true, bans: 0, findTime: '10m', maxRetry: 5 },
    { name: 'nginx-botsearch', enabled: false, bans: 0, findTime: '10m', maxRetry: 5 },
    { name: 'postfix', enabled: true, bans: 8, findTime: '10m', maxRetry: 5 },
    { name: 'dovecot', enabled: true, bans: 2, findTime: '10m', maxRetry: 5 },
    { name: 'wordpress-wp-login', enabled: false, bans: 0, findTime: '10m', maxRetry: 3 },
  ];

  const bannedIPs = [
    { ip: '203.0.113.45', jail: 'sshd', bannedAt: '2026-04-30 14:22', attempts: 8 },
    { ip: '198.51.100.22', jail: 'postfix', bannedAt: '2026-04-30 12:05', attempts: 15 },
    { ip: '192.0.2.100', jail: 'hostpanel', bannedAt: '2026-04-29 23:11', attempts: 5 },
  ];

  const serviceTemplates = [
    { name: 'Web Server', icon: Globe, ports: ['80/tcp', '443/tcp'] },
    { name: 'Email', icon: MailIcon, ports: ['25/tcp', '143/tcp', '993/tcp', '587/tcp'] },
    { name: 'SSH', icon: Server, ports: ['22/tcp'] },
    { name: 'Panel', icon: Shield, ports: ['3000/tcp'] },
    { name: 'Database', icon: Database, ports: ['3306/tcp', '5432/tcp'] },
    { name: 'FTP', icon: HardDrive, ports: ['21/tcp', '40000-50000/tcp'] },
  ];

  return (
    <PageShell title="Firewall & Fail2Ban" description="Manage UFW firewall rules and Fail2Ban intrusion prevention" icon="ShieldCheck">
      <div className="space-y-6">
        {/* Tab Switch */}
        <div className="flex gap-1 bg-panel-100 dark:bg-panel-700 rounded-lg p-1 w-fit">
          <button
            onClick={() => setTab('firewall')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              tab === 'firewall' ? 'bg-white dark:bg-panel-600 text-panel-900 dark:text-white shadow-sm' : 'text-panel-500 hover:text-panel-700'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-1.5" />
            Firewall Rules
          </button>
          <button
            onClick={() => setTab('fail2ban')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              tab === 'fail2ban' ? 'bg-white dark:bg-panel-600 text-panel-900 dark:text-white shadow-sm' : 'text-panel-500 hover:text-panel-700'
            }`}
          >
            <PowerOff className="w-4 h-4 inline mr-1.5" />
            Fail2Ban
          </button>
        </div>

        {tab === 'firewall' && (
          <>
            {/* Service Templates */}
            <div className="card">
              <div className="card-header flex items-center gap-2">
                <Wifi className="w-4 h-4 text-accent" />
                Quick Service Templates
              </div>
              <div className="card-body">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  {serviceTemplates.map((tpl) => (
                    <button
                      key={tpl.name}
                      className="p-3 rounded-lg border border-panel-200 dark:border-panel-600 hover:border-accent hover:bg-accent/5 transition-colors text-left text-sm"
                      onClick={() => toast.success(`${tpl.name} template applied`)}
                    >
                      <tpl.icon className="w-5 h-5 text-accent mb-2" />
                      <p className="font-medium text-panel-800 dark:text-panel-200">{tpl.name}</p>
                      <p className="text-xs text-panel-500 mt-1">{tpl.ports.join(', ')}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Firewall Rules Table */}
            <div className="card">
              <div className="card-header flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" />
                  <span>Active Rules</span>
                  <Badge variant="success">UFW Active</Badge>
                </div>
                <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5" onClick={() => toast.info('Add rule dialog would open')}>
                  <Plus className="w-3 h-3" /> Add Rule
                </button>
              </div>
              <div className="card-body p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-panel-100 dark:border-panel-700">
                      <th className="text-left px-6 py-3 text-panel-500 font-medium">#</th>
                      <th className="text-left px-6 py-3 text-panel-500 font-medium">Type</th>
                      <th className="text-left px-6 py-3 text-panel-500 font-medium">Port</th>
                      <th className="text-left px-6 py-3 text-panel-500 font-medium">Protocol</th>
                      <th className="text-left px-6 py-3 text-panel-500 font-medium">Source</th>
                      <th className="text-left px-6 py-3 text-panel-500 font-medium">Description</th>
                      <th className="text-right px-6 py-3 text-panel-500 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-panel-100 dark:divide-panel-700">
                    {fwRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-panel-50 dark:hover:bg-panel-700/30">
                        <td className="px-6 py-3 text-panel-500 text-xs font-mono">{rule.id}</td>
                        <td className="px-6 py-3">
                          <Badge variant={rule.type === 'allow' ? 'success' : 'danger'}>
                            {rule.type.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-6 py-3 text-panel-700 dark:text-panel-300 font-mono text-xs">{rule.port}</td>
                        <td className="px-6 py-3 text-panel-500 text-xs uppercase">{rule.protocol}</td>
                        <td className="px-6 py-3 text-panel-700 dark:text-panel-300 font-mono text-xs">{rule.source}</td>
                        <td className="px-6 py-3 text-panel-700 dark:text-panel-300 text-xs">{rule.description}</td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 rounded text-panel-400 hover:text-accent hover:bg-accent/10" title="Edit" onClick={() => toast.info('Edit rule dialog')}>
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded text-panel-400 hover:text-danger hover:bg-danger/10" title="Delete" onClick={() => toast.error('Rule deleted')}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === 'fail2ban' && (
          <>
            {/* F2B Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-xs text-panel-500">Fail2Ban</span>
                </div>
                <p className="text-lg font-bold text-panel-900 dark:text-white">Active</p>
              </div>
              <div className="card p-4">
                <span className="text-xs text-panel-500">Active Jails</span>
                <p className="text-lg font-bold text-panel-900 dark:text-white">{f2bJails.filter(j => j.enabled).length} / {f2bJails.length}</p>
              </div>
              <div className="card p-4">
                <span className="text-xs text-panel-500">Banned IPs</span>
                <p className="text-lg font-bold text-warning">{bannedIPs.length} active</p>
              </div>
              <div className="card p-4">
                <span className="text-xs text-panel-500">Total Bans</span>
                <p className="text-lg font-bold text-panel-900 dark:text-white">{f2bJails.reduce((s, j) => s + j.bans, 0)}</p>
              </div>
            </div>

            {/* Jails */}
            <div className="card">
              <div className="card-header flex items-center gap-2">
                <PowerOff className="w-4 h-4 text-accent" />
                Jails Configuration
              </div>
              <div className="card-body p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-panel-100 dark:border-panel-700">
                      <th className="text-left px-6 py-3 text-panel-500 font-medium">Jail</th>
                      <th className="text-left px-6 py-3 text-panel-500 font-medium">Status</th>
                      <th className="text-left px-6 py-3 text-panel-500 font-medium">Bans</th>
                      <th className="text-left px-6 py-3 text-panel-500 font-medium">Find Time</th>
                      <th className="text-left px-6 py-3 text-panel-500 font-medium">Max Retry</th>
                      <th className="text-right px-6 py-3 text-panel-500 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-panel-100 dark:divide-panel-700">
                    {f2bJails.map((jail) => (
                      <tr key={jail.name} className="hover:bg-panel-50 dark:hover:bg-panel-700/30">
                        <td className="px-6 py-3 text-panel-800 dark:text-panel-200 font-mono font-medium text-xs">{jail.name}</td>
                        <td className="px-6 py-3">
                          {jail.enabled ? (
                            <span className="flex items-center gap-1 text-success text-xs"><Power className="w-3 h-3" /> Enabled</span>
                          ) : (
                            <span className="flex items-center gap-1 text-panel-400 text-xs"><PowerOff className="w-3 h-3" /> Disabled</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-panel-700 dark:text-panel-300 font-mono text-xs">
                          {jail.bans > 0 ? <Badge variant="warning">{jail.bans}</Badge> : <span className="text-panel-400">0</span>}
                        </td>
                        <td className="px-6 py-3 text-panel-500 text-xs">{jail.findTime}</td>
                        <td className="px-6 py-3 text-panel-500 text-xs">{jail.maxRetry}</td>
                        <td className="px-6 py-3 text-right">
                          <button
                            className={`p-1.5 rounded text-xs ${jail.enabled ? 'text-danger hover:bg-danger/10' : 'text-success hover:bg-success/10'}`}
                            onClick={() => toast.info(`${jail.name} ${jail.enabled ? 'disabled' : 'enabled'}`)}
                          >
                            {jail.enabled ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Banned IPs */}
            {bannedIPs.length > 0 && (
              <div className="card border-warning/30">
                <div className="card-header flex items-center gap-2 text-warning">
                  <ShieldCheck className="w-4 h-4" />
                  Currently Banned IPs
                  <Badge variant="warning">{bannedIPs.length}</Badge>
                </div>
                <div className="card-body p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-panel-100 dark:border-panel-700">
                        <th className="text-left px-6 py-3 text-panel-500 font-medium">IP Address</th>
                        <th className="text-left px-6 py-3 text-panel-500 font-medium">Jail</th>
                        <th className="text-left px-6 py-3 text-panel-500 font-medium">Banned At</th>
                        <th className="text-left px-6 py-3 text-panel-500 font-medium">Attempts</th>
                        <th className="text-right px-6 py-3 text-panel-500 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-panel-100 dark:divide-panel-700">
                      {bannedIPs.map((ban) => (
                        <tr key={ban.ip} className="hover:bg-panel-50 dark:hover:bg-panel-700/30">
                          <td className="px-6 py-3 text-panel-700 dark:text-panel-300 font-mono text-xs">{ban.ip}</td>
                          <td className="px-6 py-3 text-panel-500 text-xs font-mono">{ban.jail}</td>
                          <td className="px-6 py-3 text-panel-500 text-xs">{ban.bannedAt}</td>
                          <td className="px-6 py-3"><Badge variant="danger">{ban.attempts}</Badge></td>
                          <td className="px-6 py-3 text-right">
                            <button className="text-success hover:bg-success/10 px-2 py-1 rounded text-xs font-medium" onClick={() => toast.success(`Unbanned ${ban.ip}`)}>
                              Unban
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}