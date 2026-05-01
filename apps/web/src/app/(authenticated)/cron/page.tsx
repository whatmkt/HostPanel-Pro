"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";

export default function CronPage() {
  const [jobs] = useState([
    { id: "1", command: "/usr/bin/php /var/www/example.com/cron.php", schedule: "*/5 * * * *", lastRun: "17:10", nextRun: "17:15", active: true },
    { id: "2", command: "curl -s https://example.com/wp-cron.php", schedule: "*/15 * * * *", lastRun: "17:00", nextRun: "17:15", active: true },
    { id: "3", command: "mysqldump --all-databases | gzip > /backup/db.sql.gz", schedule: "0 3 * * *", lastRun: "2026-04-30 03:00", nextRun: "2026-05-01 03:00", active: true },
  ]);

  return (
    <PageShell title="Tareas Programadas (Cron)" description="Gestiona tareas cron del sistema y de tus sitios.">
      <div className="mb-6">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ Nueva Tarea</button>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Comando</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Programación</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Última ejecución</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Próxima</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((j) => (
              <tr key={j.id} className="hover:bg-muted/20">
                <td className="p-4 font-mono text-xs">{j.command}</td>
                <td className="p-4 font-mono text-xs">{j.schedule}</td>
                <td className="p-4 text-sm text-muted-foreground">{j.lastRun}</td>
                <td className="p-4 text-sm text-muted-foreground">{j.nextRun}</td>
                <td className="p-4">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${j.active ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-600"}`}>
                    {j.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="p-4 space-x-2">
                  <button className="text-xs text-primary hover:underline">Ejecutar</button>
                  <button className="text-xs text-primary hover:underline">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}