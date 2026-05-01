"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";

export default function GitPage() {
  const [repos] = useState([
    { id: "1", domain: "example.com", repo: "github.com/user/site", branch: "main", path: "/var/www/example.com", lastDeploy: "2026-04-30 16:45", status: "ok" },
    { id: "2", domain: "myshop.com", repo: "github.com/user/shop", branch: "deploy", path: "/var/www/myshop.com", lastDeploy: "2026-04-30 12:00", status: "ok" },
  ]);

  return (
    <PageShell title="Git y Despliegues" description="Gestiona repositorios Git y despliegues automáticos.">
      <div className="mb-6">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ Conectar Repositorio</button>
      </div>
      <div className="space-y-4">
        {repos.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">{r.domain}</h4>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                Conectado
              </span>
            </div>
            <div className="grid gap-2 text-sm text-muted-foreground mb-4">
              <div className="flex gap-2"><span className="font-medium text-foreground">Repo:</span> {r.repo}</div>
              <div className="flex gap-2"><span className="font-medium text-foreground">Rama:</span> <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.branch}</code></div>
              <div className="flex gap-2"><span className="font-medium text-foreground">Ruta:</span> <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.path}</code></div>
              <div className="flex gap-2"><span className="font-medium text-foreground">Último deploy:</span> {r.lastDeploy}</div>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Deploy Ahora</button>
              <button className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent">Pull</button>
              <button className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent">Configurar</button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}