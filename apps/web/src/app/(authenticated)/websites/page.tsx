'use client';
import PageShell from '@/components/PageShell';

export default function WebsitesPage() {
  return (
    <PageShell title="Websites & Domains" description="Manage your websites, domains, subdomains, and domain aliases" icon="Globe">
      <div className="card">
        <div className="card-header">Websites</div>
        <div className="card-body text-sm text-panel-500 dark:text-panel-400">
          Website management will be available after connecting a server agent.
        </div>
      </div>
    </PageShell>
  );
}