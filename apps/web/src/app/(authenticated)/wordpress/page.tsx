'use client';
import PageShell from '@/components/PageShell';

export default function WordPressPage() {
  return (
    <PageShell title="WordPress Toolkit" description="Install, manage, and secure WordPress sites" icon="Wordpress">
      <div className="card">
        <div className="card-header">WordPress Sites</div>
        <div className="card-body text-sm text-panel-500 dark:text-panel-400">
          WordPress management will be available after connecting a server agent.
        </div>
      </div>
    </PageShell>
  );
}