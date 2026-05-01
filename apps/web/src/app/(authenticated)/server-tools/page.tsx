"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";

export default function ServerToolsPage() {
  const [services] = useState([
    { name: "nginx", status: "running" },
    { name: "PHP-FPM 8.2", status: "running" },
    { name: "PHP-FPM 8.3", status: "running" },
    { name: "MariaDB", status: "running" },
    { name: "PostgreSQL", status: "stopped" },
    { name: "Redis", status: "running" },
    { name: "Postfix", status: "running" },
    { name: "Dovecot", status: "running" },
    { name: "ClamAV", status: "running" },
    { name: "Fail2Ban", status: "running" },
  ]);

  return (
    <PageShell title="Herramientas del Servidor" description="Gestiona servicios, configuraciones y mantenimiento del servidor.">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
        <button className="rounded-xl border border-border bg-card p-5 shadow-sm text-left hover:bg-accent transition-colors">
          <div className="text-2xl mb-1">🔄</div>
          <div className="font-semibold text-sm">Reiniciar Todo</div>
          <div className="text-xs text-muted-foreground mt-1">Reinicio seguro de servicios</div>
        </button>
        <button className="rounded-xl border border-border bg-card p-5 shadow-sm text-left hover:bg-accent transition-colors">
          <div className="text-2xl mb-1">🧹</div>
          <div className="font-semibold text-sm">Limpiar Temporales</div>
          <div className="text-xs text-muted-foreground mt-1">Cache, tmp, logs rotados</div>
        </button>
        <button className="rounded-xl border border-border bg-card p-5 shadow-sm text-left hover:bg-accent transition-colors">
          <div className="text-2xl mb-1">📦</div>
          <div className="font-semibold text-sm">Actualizar Paquetes</div>
          <div className="text-xs text-muted-foreground mt-1">apt update/upgrade</div>
        </button>
        <button className="rounded-xl border border-border bg-card p-5 shadow-sm text-left hover:bg-accent transition-colors">
          <div className="text-2xl mb-1">🔍</div>
          <div className="font-semibold text-sm">Diagnóstico</div>
          <div className="text-xs text-muted-foreground mt-1">Revisión completa del sistema</div>
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-4">Servicios del Sistema</h3>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Servicio</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services.map((s) => (
              <tr key={s.name} className="hover:bg-muted/20">
                <td className="p-4 font-medium">{s.name}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    s.status === "running" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${s.status === "running" ? "bg-emerald-500" : "bg-slate-400"}`} />
                    {s.status === "running" ? "Activo" : "Detenido"}
                  </span>
                </td>
                <td className="p-4 space-x-2">
                  {s.status === "running" ? (
                    <>
                      <button className="text-xs text-amber-600 hover:underline">Restart</button>
                      <button className="text-xs text-red-600 hover:underline">Stop</button>
                    </>
                  ) : (
                    <button className="text-xs text-primary hover:underline">Start</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}