'use client';
import { useState } from 'react';
import PageShell from '@/components/PageShell';
import { Bug, ShieldCheck, Scan, Clock, RefreshCw, AlertTriangle, CheckCircle2, XCircle, FileSearch, Trash2, Archive, Play } from 'lucide-react';
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

export default function AntivirusPage() {
  const [scanning, setScanning] = useState(false);

  const scanHistory = [
    { id: 1, date: '2026-04-30 08:00', type: 'Scheduled', files: 124532, threats: 0, status: 'clean' },
    { id: 2, date: '2026-04-29 08:00', type: 'Scheduled', files: 124301, threats: 1, status: 'threat_found' },
    { id: 3, date: '2026-04-28 14:22', type: 'Manual', files: 54210, threats: 0, status: 'clean' },
    { id: 4, date: '2026-04-27 08:00', type: 'Scheduled', files: 123980, threats: 0, status: 'clean' },
  ];

  const quarantineItems = [
    { id: 1, file: '/var/www/example.com/htdocs/wp-content/uploads/shell.php', threat: 'PHP.Backdoor.Shell-1', date: '2026-04-29', size: '2.1 KB' },
  ];

  const claStatus = [
    { label: 'ClamAV Daemon', status: 'running' },
    { label: 'Signature Database', status: 'up_to_date' },
    { label: 'Last Signature Update', status: '2026-04-30 06:15' },
    { label: 'Database Version', status: '27345' },
    { label: 'Engine Version', status: '1.4.1' },
  ];

  return (
    <PageShell title="Antivirus & Malware Scanner" description="ClamAV-based virus and malware scanning for files, mail, and domains" icon="Bug">
      <div className="space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs text-panel-500">ClamAV</span>
            </div>
            <p className="text-lg font-bold text-panel-900 dark:text-white">Running</p>
          </div>
          <div className="card p-4">
            <span className="text-xs text-panel-500">Sigs Updated</span>
            <p className="text-lg font-bold text-panel-900 dark:text-white">6h ago</p>
          </div>
          <div className="card p-4">
            <span className="text-xs text-panel-500">Last Scan</span>
            <p className="text-lg font-bold text-panel-900 dark:text-white">Today 08:00</p>
          </div>
          <div className="card p-4">
            <span className="text-xs text-panel-500">Files Scanned</span>
            <p className="text-lg font-bold text-panel-900 dark:text-white">124K</p>
          </div>
          <div className="card p-4">
            <span className="text-xs text-panel-500">Quarantined</span>
            <p className="text-lg font-bold text-warning">1 item</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => { setScanning(true); toast.info('Scan started...'); setTimeout(() => { setScanning(false); toast.success('Scan completed. No threats found.'); }, 2500); }}
            disabled={scanning}
            className="btn-primary flex items-center gap-2"
          >
            {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
            {scanning ? 'Scanning...' : 'Start Full Scan'}
          </button>
          <button className="btn-secondary flex items-center gap-2" onClick={() => toast.info('Scan scheduled for tomorrow 08:00')}>
            <Clock className="w-4 h-4" /> Schedule Scan
          </button>
          <button className="btn-secondary flex items-center gap-2" onClick={() => toast.success('Virus signatures updated')}>
            <RefreshCw className="w-4 h-4" /> Update Signatures
          </button>
        </div>

        {/* ClamAV Status */}
        <div className="card">
          <div className="card-header flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-success" />
            ClamAV Engine Status
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {claStatus.map((s) => (
                <div key={s.label} className="p-3 rounded-lg bg-panel-50 dark:bg-panel-700/50">
                  <p className="text-xs text-panel-500 mb-1">{s.label}</p>
                  <p className="text-sm font-semibold text-panel-800 dark:text-panel-200">{s.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scan History */}
        <div className="card">
          <div className="card-header flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-accent" />
            Scan History
          </div>
          <div className="card-body p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-panel-100 dark:border-panel-700">
                  <th className="text-left px-6 py-3 text-panel-500 font-medium">Date</th>
                  <th className="text-left px-6 py-3 text-panel-500 font-medium">Type</th>
                  <th className="text-left px-6 py-3 text-panel-500 font-medium">Files</th>
                  <th className="text-left px-6 py-3 text-panel-500 font-medium">Threats</th>
                  <th className="text-left px-6 py-3 text-panel-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panel-100 dark:divide-panel-700">
                {scanHistory.map((scan) => (
                  <tr key={scan.id} className="hover:bg-panel-50 dark:hover:bg-panel-700/30">
                    <td className="px-6 py-3 text-panel-700 dark:text-panel-300">{scan.date}</td>
                    <td className="px-6 py-3">
                      <Badge variant={scan.type === 'Scheduled' ? 'info' : 'warning'}>{scan.type}</Badge>
                    </td>
                    <td className="px-6 py-3 text-panel-700 dark:text-panel-300 font-mono">{scan.files.toLocaleString()}</td>
                    <td className="px-6 py-3">
                      {scan.threats > 0 ? <Badge variant="danger">{scan.threats}</Badge> : <Badge variant="success">0</Badge>}
                    </td>
                    <td className="px-6 py-3">
                      {scan.status === 'clean' ? (
                        <span className="flex items-center gap-1 text-success text-xs"><CheckCircle2 className="w-3 h-3" /> Clean</span>
                      ) : (
                        <span className="flex items-center gap-1 text-warning text-xs"><AlertTriangle className="w-3 h-3" /> Threat found</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quarantine */}
        {quarantineItems.length > 0 && (
          <div className="card border-warning/50">
            <div className="card-header flex items-center gap-2 text-warning">
              <Archive className="w-4 h-4" />
              Quarantine
              <Badge variant="warning">{quarantineItems.length}</Badge>
            </div>
            <div className="card-body p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-panel-100 dark:border-panel-700">
                    <th className="text-left px-6 py-3 text-panel-500 font-medium">File</th>
                    <th className="text-left px-6 py-3 text-panel-500 font-medium">Threat</th>
                    <th className="text-left px-6 py-3 text-panel-500 font-medium">Date</th>
                    <th className="text-left px-6 py-3 text-panel-500 font-medium">Size</th>
                    <th className="text-right px-6 py-3 text-panel-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-panel-100 dark:divide-panel-700">
                  {quarantineItems.map((item) => (
                    <tr key={item.id} className="hover:bg-panel-50 dark:hover:bg-panel-700/30">
                      <td className="px-6 py-3 text-panel-700 dark:text-panel-300 font-mono text-xs">{item.file}</td>
                      <td className="px-6 py-3"><Badge variant="danger">{item.threat}</Badge></td>
                      <td className="px-6 py-3 text-panel-500 text-xs">{item.date}</td>
                      <td className="px-6 py-3 text-panel-500 text-xs">{item.size}</td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 rounded text-success hover:bg-success/10" title="Restore (false positive)" onClick={() => toast.success('File restored from quarantine')}>
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded text-danger hover:bg-danger/10" title="Delete permanently" onClick={() => toast.error('File permanently deleted')}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}