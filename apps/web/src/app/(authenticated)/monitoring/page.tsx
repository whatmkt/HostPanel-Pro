"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";

export default function MonitoringPage() {
  const [metrics] = useState([
    { label: "CPU", value: "23%", sub: "4 cores", status: "ok" },
    { label: "RAM", value: "58%", sub: "3.8 / 8 GB", status: "ok" },
    { label: "Disco", value: "42%", sub: "84 / 200 GB", status: "ok" },
    { label: "Load", value: "1.2", sub: "1min avg", status: "ok" },
    { label: "Red IN", value: "12 Mbps", sub: "eth0", status: "ok" },
    { label: "Red OUT", value: "8 Mbps", sub: "eth0", status: "ok" },
    { label: "Peticiones", value: "345/min", sub: "nginx", status: "ok" },
    { label: "Errores 5xx", value: "2/h", sub: "bajo", status: "warning" },
  ]);

  const [services] = useState([
    { name: "nginx", status: "running", uptime: "7d 12h" },
    { name: "PHP-FPM 8.2", status: "running", uptime: "7d 12h" },
    { name: "MariaDB", status: "running", uptime: "7d 12h" },
    { name: "PostgreSQL", status: "running", uptime: "7d 12h" },
    { name: "Redis", status: "running", uptime: "7d 12h" },
    { name: "Postfix", status: "running", uptime: "7d 12h" },
    { name: "Dovecot", status: "running", uptime: "7d 12h" },
    { name: "ClamAV", status: "running", uptime: "7d 12h" },
    { name: "Fail2Ban", status: "running", uptime: "7d 12h" },
    { name: "UFW", status: "running", uptime: "7d 12h" },
  ]);

  return (
    <PageShell title="Monitorización" description="Monitoriza el estado y rendimiento de tu servidor en tiempo real.">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">{m.label}</span>
              <span className={`h-2 w-2 rounded-full ${
                m.status === "ok" ? "bg-emerald-500" : m.status === "warning" ? "bg-amber-500" : "bg-red-500"
              }`} />
            </div>
            <div className="text-3xl font-bold">{m.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{m.sub}</div>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-4">Servicios</h3>
      <div className="rounded-xl border border-border bg-card overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Servicio</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Uptime</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {services.map((s) => (
                <tr key={s.name} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-medium">{s.name}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Activo
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{s.uptime}</td>
                  <td className="p-4">
                    <button className="text-xs text-primary hover:underline">Reiniciar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-4">Alertas recientes</h3>
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20">
            <span className="mt-0.5 h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">CPU por encima del 85% durante 10 minutos</p>
              <p className="text-xs text-muted-foreground mt-0.5">Hace 2 horas</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
            <span className="mt-0.5 h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Disco al 92% de capacidad</p>
              <p className="text-xs text-muted-foreground mt-0.5">Ayer 22:45</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <span className="mt-0.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Backup completado: cliente-acme-corp</p>
              <p className="text-xs text-muted-foreground mt-0.5">Ayer 03:00</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}