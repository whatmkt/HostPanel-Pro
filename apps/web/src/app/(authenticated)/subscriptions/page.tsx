"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";

export default function SubscriptionsPage() {
  const [subscriptions] = useState([
    { id: "1", client: "Acme Corp", plan: "Business", status: "active", start: "2026-01-15", next: "2026-07-15", price: "€12.99/mo", domains: 5 },
    { id: "2", client: "StartupLab", plan: "Professional", status: "active", start: "2026-03-01", next: "2026-09-01", price: "€24.99/mo", domains: 12 },
    { id: "3", client: "WebStudio", plan: "Starter", status: "suspended", start: "2025-11-20", next: "2026-05-20", price: "€4.99/mo", domains: 2 },
  ]);

  return (
    <PageShell title="Suscripciones" description="Gestiona las suscripciones activas y su renovación.">
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cliente</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plan</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inicio</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Próximo pago</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Precio</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dominios</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscriptions.map((s) => (
                <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-medium">{s.client}</td>
                  <td className="p-4">{s.plan}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      s.status === "active" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}>
                      {s.status === "active" ? "Activa" : "Suspendida"}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{s.start}</td>
                  <td className="p-4 text-muted-foreground">{s.next}</td>
                  <td className="p-4">{s.price}</td>
                  <td className="p-4 text-muted-foreground">{s.domains}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}