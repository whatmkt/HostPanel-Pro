'use client';
import PageShell from '@/components/PageShell';

export default function DatabasesPage() {
  return (
    <PageShell title="Databases" description="Manage MySQL, MariaDB, and PostgreSQL databases" icon="Database">
      <div className="card">
        <div className="card-header">Databases</div>
        <div className="card-body text-sm text-panel-500 dark:text-panel-400">
          Database management will be available after connecting a server agent.
        </div>
      </div>
    </PageShell>
  );
}