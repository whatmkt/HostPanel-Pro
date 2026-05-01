"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";

export default function NotificationsPage() {
  const [notifications] = useState([
    { id: "1", type: "warning", title: "SSL próximo a caducar", message: "El certificado de example.com caduca en 7 días.", date: "2026-04-30 17:00", read: false },
    { id: "2", type: "error", title: "Backup fallido", message: "El backup programado de myshop.com ha fallado. Error de conexión SFTP.", date: "2026-04-30 14:00", read: false },
    { id: "3", type: "success", title: "Backup completado", message: "Backup completo del servidor creado exitosamente.", date: "2026-04-30 12:00", read: true },
    { id: "4", type: "info", title: "Actualización disponible", message: "HostPanel Pro v1.0.1 disponible con mejoras de seguridad.", date: "2026-04-30 10:00", read: true },
    { id: "5", type: "warning", title: "Disco al 85%", message: "El uso de disco ha alcanzado el 85%. Considere liberar espacio.", date: "2026-04-29 18:00", read: true },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case "error": return "🔴";
      case "warning": return "🟡";
      case "success": return "🟢";
      case "info": return "🔵";
      default: return "⚪";
    }
  };

  const getCardStyle = (type: string) => {
    switch (type) {
      case "error": return "border-l-red-500 bg-red-50/50 dark:bg-red-950/10";
      case "warning": return "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/10";
      case "success": return "border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/10";
      case "info": return "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/10";
      default: return "border-l-slate-300";
    }
  };

  return (
    <PageShell title="Notificaciones" description="Centro de notificaciones y alertas del panel.">
      <div className="flex gap-3 mb-6">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Marcar todo leído</button>
        <button className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent">Configurar alertas</button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`rounded-xl border border-border bg-card p-4 shadow-sm border-l-4 transition-all hover:shadow-md ${getCardStyle(n.type)} ${!n.read ? "ring-1 ring-primary/20" : ""}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5">{getIcon(n.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-semibold text-sm ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</h4>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{n.date}</p>
              </div>
              <button className="text-xs text-muted-foreground hover:text-foreground flex-shrink-0">✕</button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}