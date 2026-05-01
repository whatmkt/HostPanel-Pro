"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";

export default function SettingsPage() {
  const [tab, setTab] = useState("general");

  const tabs = [
    { id: "general", label: "General" },
    { id: "security", label: "Seguridad" },
    { id: "notifications", label: "Notificaciones" },
    { id: "maintenance", label: "Mantenimiento" },
    { id: "api", label: "API" },
  ];

  return (
    <PageShell title="Configuración" description="Configura los ajustes del panel y del servidor.">
      <div className="flex border-b border-border mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "general" && (
        <div className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm font-medium mb-1.5">Nombre del panel</label>
            <input type="text" defaultValue="HostPanel Pro" className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">URL del panel</label>
            <input type="text" defaultValue="https://panel.example.com" className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Zona horaria</label>
            <select className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm focus:border-primary focus:outline-none">
              <option>Europe/Madrid</option>
              <option>UTC</option>
              <option>America/New_York</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Idioma</label>
            <select className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm focus:border-primary focus:outline-none">
              <option>Español</option>
              <option>English</option>
            </select>
          </div>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Guardar Cambios</button>
        </div>
      )}

      {tab === "security" && (
        <div className="space-y-6 max-w-2xl">
          <p className="text-sm text-muted-foreground">Configuración de seguridad del panel y autenticación.</p>
        </div>
      )}

      {tab === "api" && (
        <div className="space-y-6 max-w-2xl">
          <p className="text-sm text-muted-foreground">Tokens de API y configuración de endpoints.</p>
        </div>
      )}
    </PageShell>
  );
}