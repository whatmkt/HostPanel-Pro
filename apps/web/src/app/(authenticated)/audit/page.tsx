"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";

export default function AuditPage() {
  const [events] = useState([
    { id: "1", user: "admin@hostpanel.local", action: "LOGIN", resource: "Auth", result: "SUCCESS", ip: "192.168.1.100", date: "2026-04-30 17:15:22" },
    { id: "2", user: "admin@hostpanel.local", action: "CREATE_DOMAIN", resource: "Domain:example.com", result: "SUCCESS", ip: "192.168.1.100", date: "2026-04-30 16:45:10" },
    { id: "3", user: "client@example.com", action: "LOGIN_FAILED", resource: "Auth", result: "FAILURE", ip: "203.0.113.42", date: "2026-04-30 16:30:05" },
    { id: "4", user: "admin@hostpanel.local", action: "CREATE_MAILBOX", resource: "Mail:info@example.com", result: "SUCCESS", ip: "192.168.1.100", date: "2026-04-30 16:20:00" },
    { id: "5", user: "admin@hostpanel.local", action: "UPDATE_SSL", resource: "SSL:example.com", result: "SUCCESS", ip: "192.168.1.100", date: "2026-04-30 15:55:30" },
    { id: "6", user: "admin@hostpanel.local", action: "CREATE_BACKUP", resource: "Backup:myshop.com", result: "SUCCESS", ip: "192.168.1.100", date: "2026-04-30 14:00:00" },
    { id: "7", user: "client@example.com", action: "DELETE_FILE", resource: "File:/var/www/example.com/test.txt", result: "SUCCESS", ip: "203.0.113.42", date: "2026-04-30 13:22:15" },
    { id: "8", user: "admin@hostpanel.local", action: "MALWARE_SCAN", resource: "Security", result: "SUCCESS", ip: "192.168.1.100", date: "2026-04-30 12:00:00" },
  ]);

  const getResultColor = (result: string) => {
    return result === "SUCCESS"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  };

  return (
    <PageShell title="Auditoría" description="Registro completo de acciones realizadas en el panel.">
      <div className="flex gap-3 flex-wrap mb-6">
        <input type="text" placeholder="Buscar en auditoría..." className="rounded-lg border border-border bg-card px-4 py-2 text-sm focus:border-primary focus:outline-none min-w-[260px]" />
        <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none">
          <option>Todos los usuarios</option>
          <option>admin@hostpanel.local</option>
          <option>client@example.com</option>
        </select>
        <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none">
          <option>Todas las acciones</option>
          <option>LOGIN</option>
          <option>CREATE</option>
          <option>UPDATE</option>
          <option>DELETE</option>
          <option>BACKUP</option>
        </select>
        <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none">
          <option>Todos los resultados</option>
          <option>SUCCESS</option>
          <option>FAILURE</option>
        </select>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha</th>
              <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Usuario</th>
              <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acción</th>
              <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recurso</th>
              <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resultado</th>
              <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-muted/20">
                <td className="p-3 text-sm font-mono text-muted-foreground whitespace-nowrap">{e.date}</td>
                <td className="p-3 text-sm">{e.user}</td>
                <td className="p-3 text-sm">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">{e.action}</code>
                </td>
                <td className="p-3 text-sm text-muted-foreground">{e.resource}</td>
                <td className="p-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getResultColor(e.result)}`}>
                    {e.result === "SUCCESS" ? "Éxito" : "Fallido"}
                  </span>
                </td>
                <td className="p-3 text-sm font-mono text-muted-foreground">{e.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        Mostrando {events.length} eventos recientes de 1,247 totales
      </div>
    </PageShell>
  );
}