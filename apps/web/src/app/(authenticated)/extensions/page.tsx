"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";

export default function ExtensionsPage() {
  const [extensions] = useState([
    { id: "wp-toolkit", name: "WordPress Toolkit", version: "1.2.0", author: "HostPanel", active: true, description: "Gestión completa de sitios WordPress" },
    { id: "perf-booster", name: "Performance Booster", version: "1.0.0", author: "HostPanel", active: true, description: "Optimización de rendimiento web" },
    { id: "malware-scanner", name: "Malware Scanner", version: "1.1.0", author: "HostPanel", active: true, description: "Escáner de malware con ClamAV" },
    { id: "backup-manager", name: "Backup Manager", version: "1.0.0", author: "HostPanel", active: false, description: "Gestión avanzada de backups" },
    { id: "docker-mgr", name: "Docker Manager", version: "0.9.0", author: "HostPanel", active: true, description: "Gestión de contenedores Docker" },
  ]);

  return (
    <PageShell title="Extensiones" description="Gestiona las extensiones y plugins del panel.">
      <div className="mb-6">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ Instalar Extensión</button>
      </div>
      <div className="space-y-4">
        {extensions.map((ext) => (
          <div key={ext.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold">{ext.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">v{ext.version} • {ext.author}</p>
              </div>
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                ext.active ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}>
                {ext.active ? "Activo" : "Inactivo"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{ext.description}</p>
            <div className="flex gap-2">
              {ext.active ? (
                <button className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-accent">Desactivar</button>
              ) : (
                <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">Activar</button>
              )}
              <button className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-accent">Configurar</button>
              <button className="rounded-lg border border-border px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}