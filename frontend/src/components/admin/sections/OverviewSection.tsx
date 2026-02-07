"use client";

import React from "react";
import { Card } from "@/components/admin/ui/Card";
import { Button } from "@/components/admin/ui/Button";
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme";
import { KPI, EmptyState } from "@/components/admin/sections/common";
import { formatCurrency, formatNumber } from "@/components/admin/utils/format";

export const OverviewSection: React.FC = () => {
  const { dark } = useAdminTheme();
  const ingresosHoy = 25340;
  const ingresosMes = 723450;
  const pedidosHoy = 48;
  const pedidosPendientes = 12;
  const conversion = 2.8;
  const ticket = 520.5;
  const stockBajo = 7;
  const nuevosClientes = 14;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <KPI label="Ingresos hoy" value={formatCurrency(ingresosHoy)} deltaPct={5.2} hint="vs ayer" />
        <KPI label="Ingresos mes" value={formatCurrency(ingresosMes)} deltaPct={-1.3} hint="vs mes anterior" />
        <KPI label="Pedidos (hoy/pend.)" value={`${formatNumber(pedidosHoy)} / ${formatNumber(pedidosPendientes)}`} deltaPct={2.1} />
        <KPI label="Tasa conversión" value={`${conversion.toFixed(2)}%`} deltaPct={0.4} />
        <KPI label="Ticket promedio" value={formatCurrency(ticket)} deltaPct={-0.7} />
        <KPI label="Stock bajo" value={String(stockBajo)} deltaPct={-0.2} />
        <KPI label="Nuevos clientes" value={String(nuevosClientes)} deltaPct={3.4} />
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <Card title="Ingresos por día (30d)" description="Línea">
          <div className={`h-48 w-full rounded-xl ${dark ? "bg-gradient-to-b from-white/5 to-transparent shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" : "bg-gradient-to-b from-black/5 to-transparent shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"}`} />
          <p className={`mt-2 text-[11px] ${dark ? "text-gray-400" : "text-gray-600"}`}>Carga diferida de gráficos en producción.</p>
        </Card>
        <Card title="Ventas por categoría" description="Barras">
          <div className={`h-48 w-full rounded-xl ${dark ? "bg-gradient-to-b from-white/5 to-transparent shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" : "bg-gradient-to-b from-black/5 to-transparent shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"}`} />
        </Card>
        <Card title="Métodos de pago" description="Dona">
          <div className={`h-48 w-full rounded-xl ${dark ? "bg-gradient-to-b from-white/5 to-transparent shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" : "bg-gradient-to-b from-black/5 to-transparent shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"}`} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Últimos pedidos" right={<Button variant="outline" size="sm">Ver todos</Button>}>
          <ul className={`divide-y text-sm ${dark ? "divide-white/10" : "divide-black/10"}`}>
            {["#1042", "#1041", "#1040", "#1039", "#1038"].map((id) => (
              <li key={id} className="flex items-center justify-between py-2">
                <span className={`${dark ? "text-gray-200" : "text-gray-900"}`}>Pedido {id}</span>
                <span className={`${dark ? "text-gray-400" : "text-gray-600"}`}>hoy</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Productos top" right={<Button variant="outline" size="sm">Ver catálogo</Button>}>
          <ul className={`divide-y text-sm ${dark ? "divide-white/10" : "divide-black/10"}`}>
            {["SSD NVMe 1TB", "Laptop Pro 14", "Teclado Mecánico", "Monitor 27"].map((p) => (
              <li key={p} className="flex items-center justify-between py-2">
                <span className={`${dark ? "text-gray-200" : "text-gray-900"}`}>{p}</span>
                <span className={`${dark ? "text-gray-400" : "text-gray-600"}`}>{formatCurrency(100000)}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Tickets abiertos" right={<Button variant="outline" size="sm">Ver soporte</Button>}>
          <EmptyState title="Sin tickets abiertos" description="¡Todo en orden!" />
        </Card>
      </div>
    </div>
  );
};
