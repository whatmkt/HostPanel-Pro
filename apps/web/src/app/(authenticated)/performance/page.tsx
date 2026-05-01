"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";

export default function PerformancePage() {
  const [mode, setMode] = useState("safe");

  return (
    <PageShell title="Rendimiento y Caché" description="Optimiza el rendimiento de tus sitios web y del servidor.">
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">OPcache</h3>
          <div className="text-2xl font-bold text-emerald-600">Activo</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">gzip / brotli</h3>
          <div className="text-2xl font-bold text-emerald-600">gzip Activo</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">FastCGI Cache</h3>
          <div className="text-2xl font-bold text-amber-600">Inactivo</div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-4">Modo de optimización</h3>
      <div className="flex flex-wrap gap-3 mb-8">
        {["safe", "wordpress", "woocommerce", "max", "custom"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-4 py-2 text-sm font-medium border transition-all ${
              mode === m
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card hover:bg-accent"
            }`}
          >
            {m === "safe" && "Modo Seguro"}
            {m === "wordpress" && "WordPress"}
            {m === "woocommerce" && "WooCommerce"}
            {m === "max" && "Máximo Rendimiento"}
            {m === "custom" && "Personalizado"}
          </button>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-4">Recomendaciones</h3>
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-start gap-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 text-sm font-bold">1</div>
          <div>
            <p className="text-sm font-medium">Activar brotli para mejor compresión</p>
            <p className="text-xs text-muted-foreground mt-0.5">Reduce el tamaño de transferencia un 15-20% vs gzip</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 text-sm font-bold">2</div>
          <div>
            <p className="text-sm font-medium">Configurar browser cache para estáticos</p>
            <p className="text-xs text-muted-foreground mt-0.5">CSS, JS, imágenes y fuentes deberían cachearse 30 días</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 text-sm font-bold">3</div>
          <div>
            <p className="text-sm font-medium">Ajustar memory_limit de PHP a 256M</p>
            <p className="text-xs text-muted-foreground mt-0.5">El límite actual es 128M. Recomendado 256M para CMS modernos</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}