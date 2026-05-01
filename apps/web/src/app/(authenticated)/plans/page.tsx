"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";

export default function PlansPage() {
  const [plans] = useState([
    { id: "1", name: "Starter", disk: "10 GB", bandwidth: "100 GB", domains: 3, databases: 5, email: 10, price: "€4.99/mo", active: true },
    { id: "2", name: "Business", disk: "50 GB", bandwidth: "500 GB", domains: 10, databases: 25, email: 100, price: "€12.99/mo", active: true },
    { id: "3", name: "Professional", disk: "100 GB", bandwidth: "1 TB", domains: 50, databases: 100, email: 500, price: "€24.99/mo", active: true },
    { id: "4", name: "Enterprise", disk: "250 GB", bandwidth: "5 TB", domains: 999, databases: 999, email: 9999, price: "€49.99/mo", active: false },
  ]);

  return (
    <PageShell title="Planes de Hosting" description="Gestiona los planes de hosting disponibles para tus clientes.">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                plan.active ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}>
                {plan.active ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div className="text-3xl font-bold mb-6">{plan.price}</div>
            <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {plan.disk} Disco SSD
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {plan.bandwidth} Ancho de banda
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {plan.domains} Dominios
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {plan.databases} Bases de datos
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {plan.email} Buzones
              </li>
            </ul>
            <div className="flex gap-2">
              <button className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Editar
              </button>
              <button className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent">
                Duplicar
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          + Crear Plan
        </button>
      </div>
    </PageShell>
  );
}