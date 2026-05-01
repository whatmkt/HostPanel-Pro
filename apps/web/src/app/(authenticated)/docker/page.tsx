"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";

export default function DockerPage() {
  const [containers] = useState([
    { id: "abc123", name: "uptime-kuma", image: "louislam/uptime-kuma:latest", status: "running", ports: "3001:3001", uptime: "4d 2h" },
    { id: "def456", name: "n8n", image: "n8nio/n8n:latest", status: "running", ports: "5678:5678", uptime: "7d 12h" },
    { id: "ghi789", name: "adminer", image: "adminer:latest", status: "stopped", ports: "8081:8080", uptime: "-" },
  ]);

  return (
    <PageShell title="Docker y Aplicaciones" description="Gestiona contenedores e imágenes Docker.">
      <div className="flex gap-3 mb-6">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ Nuevo Contenedor</button>
        <button className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent">Imágenes</button>
        <button className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent">Volúmenes</button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-emerald-600">3</div>
          <div className="text-sm text-muted-foreground mt-1">Contenedores</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-emerald-600">2</div>
          <div className="text-sm text-muted-foreground mt-1">En ejecución</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-amber-600">1</div>
          <div className="text-sm text-muted-foreground mt-1">Detenido</div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nombre</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Imagen</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Puertos</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uptime</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {containers.map((c) => (
              <tr key={c.id} className="hover:bg-muted/20">
                <td className="p-4 font-medium font-mono text-sm">{c.name}</td>
                <td className="p-4 text-sm text-muted-foreground">{c.image}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    c.status === "running" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${c.status === "running" ? "bg-emerald-500" : "bg-slate-400"}`} />
                    {c.status === "running" ? "Activo" : "Detenido"}
                  </span>
                </td>
                <td className="p-4 text-sm font-mono">{c.ports}</td>
                <td className="p-4 text-sm text-muted-foreground">{c.uptime}</td>
                <td className="p-4 space-x-2">
                  {c.status === "running" ? (
                    <button className="text-xs text-red-600 hover:underline">Stop</button>
                  ) : (
                    <button className="text-xs text-primary hover:underline">Start</button>
                  )}
                  <button className="text-xs text-primary hover:underline">Logs</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}