'use client';
import PageShell from '@/components/PageShell';

export default function EmailPage() {
  return (
    <PageShell title="Email" description="Manage mail domains, mailboxes, aliases, and forwarders" icon="Mail">
      <div className="card"><div className="card-header">Email Management</div>
      <div className="card-body text-sm text-panel-500 dark:text-panel-400">Email management will be available after connecting a server agent.</div></div>
    </PageShell>
  );
}