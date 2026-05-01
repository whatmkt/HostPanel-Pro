"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";

export default function UpdatesPage() {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <PageShell title="Actualizaciones" description="Gestiona las actualizaciones del panel y del servidor.">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h4 className="font-semibold text-sm mb-1">HostPanel Pro</h4>
          <p className="text-2xl font-bold mb-1">1.0.0</p>
          <p className="text-xs text-muted-foreground mb-3">Actualizado • Última comprobación: hoy 15:30</p>
          <button
            onClick={() => setShowConfirm(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 w-full"
          >
            Actualizar Panel
          </button>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h4 className="font-semibold text-sm mb-1">Paquetes del Sistema</h4>
          <p className="text-2xl font-bold mb-1">5 pendientes</p>
          <p className="text-xs text-muted-foreground mb-3">3 de seguridad • Última comprobación: ayer</p>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 w-full">
            Actualizar Todo
          </button>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h4 className="font-semibold text-sm mb-1">Historial</h4>
          <p className="text-xs text-muted-foreground mb-1">v1.0.0 — Instalación inicial</p>
          <p className="text-xs text-muted-foreground">30 abril 2026</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-4">Configuración de Actualizaciones</h3>
      <div className="space-y-4 max-w-xl">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" defaultChecked className="rounded border-border" />
          <div>
            <div className="text-sm font-medium">Actualizaciones automáticas del panel</div>
            <div className="text-xs text-muted-foreground">Aplica actualizaciones de seguridad automáticamente</div>
          </div>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" defaultChecked className="rounded border-border" />
          <div>
            <div className="text-sm font-medium">Backup antes de actualizar</div>
            <div className="text-xs text-muted-foreground">Crea un backup automático antes de cada actualización</div>
          </div>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="rounded border-border" />
          <div>
            <div className="text-sm font-medium">Modo mantenimiento durante actualizaciones</div>
            <div className="text-xs text-muted-foreground">Muestra página de mantenimiento durante la actualización</div>
          </div>
        </label>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-xl border border-border bg-card p-6 shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">¿Actualizar Panel?</h3>
            <p className="text-sm text-muted-foreground mb-1">Se creará un backup automático antes de la actualización.</p>
            <p className="text-sm text-muted-foreground mb-4">El panel puede estar no disponible durante 1-2 minutos.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirm(false)} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent">Cancelar</button>
              <button onClick={() => setShowConfirm(false)} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Actualizar Ahora</button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}