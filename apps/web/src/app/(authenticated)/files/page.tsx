'use client';
import PageShell from '@/components/PageShell';

export default function FilesPage() {
  return (
    <PageShell title="File Manager" description="Browse, edit, and manage files on your server" icon="FolderOpen">
      <div className="card">
        <div className="card-header">Files</div>
        <div className="card-body text-sm text-panel-500 dark:text-panel-400">
          File management will be available after connecting a server agent.
        </div>
      </div>
    </PageShell>
  );
}