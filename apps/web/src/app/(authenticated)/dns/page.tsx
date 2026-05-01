'use client';
import PageShell from '@/components/PageShell';
export default function DnsPage() {
  return (
    <PageShell title="DNS" description="Manage DNS zones and records" icon="Server">
      <div className="card"><div className="card-header">DNS Zones</div>
      <div className="card-body text-sm text-panel-500 dark:text-panel-400">DNS management will be available after connecting a server agent.</div></div>
    </PageShell>
  );
}