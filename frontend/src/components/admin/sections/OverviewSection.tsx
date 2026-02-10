"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/admin/ui/Card";
import { Button } from "@/components/admin/ui/Button";
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme";
import { KPI, EmptyState } from "@/components/admin/sections/common";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import { formatCurrency, formatDate } from "@/components/admin/utils/format";
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { getAllPedidos, type Pedido } from "@/api/pedidos";
import { getAllRefacciones, type Refaccion } from "@/api/productos";
import { getEstadisticasVentas, type EstadisticasVentas } from "@/api/ventas";

type DashboardData = {
  pedidos: Pedido[];
  pedidosCount: number;
  refacciones: Refaccion[];
  estadisticas: EstadisticasVentas | null;
};

function KPISkeleton() {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </Card>
  );
}

function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

const ESTADO_STYLES: Record<string, { dark: string; light: string }> = {
  CRE: { dark: "bg-slate-500/15 text-slate-300", light: "bg-slate-100 text-slate-700" },
  PAG: { dark: "bg-emerald-500/15 text-emerald-400", light: "bg-emerald-50 text-emerald-700" },
  ENV: { dark: "bg-blue-500/15 text-blue-400", light: "bg-blue-50 text-blue-700" },
  ENT: { dark: "bg-violet-500/15 text-violet-400", light: "bg-violet-50 text-violet-700" },
  CAN: { dark: "bg-red-500/15 text-red-400", light: "bg-red-50 text-red-700" },
};

const ESTADO_LABELS: Record<string, string> = {
  CRE: "Creado",
  PAG: "Pagado",
  ENV: "Enviado",
  ENT: "Entregado",
  CAN: "Cancelado",
};

export const OverviewSection: React.FC = () => {
  const { dark } = useAdminTheme();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pedidosRes, refacciones, estadisticas] = await Promise.all([
        getAllPedidos(1).catch(() => ({ results: [], count: 0 })),
        getAllRefacciones().catch(() => []),
        getEstadisticasVentas("mes").catch(() => null),
      ]);

      setData({
        pedidos: pedidosRes.results ?? [],
        pedidosCount: pedidosRes.count ?? 0,
        refacciones: Array.isArray(refacciones) ? refacciones : [],
        estadisticas,
      });
    } catch {
      setError("No se pudieron cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Computed values
  const refacciones = data?.refacciones ?? [];
  const pedidos = data?.pedidos ?? [];
  const stats = data?.estadisticas;

  const totalProductos = refacciones.length;
  const stockBajo = refacciones.filter((r) => r.existencias <= 3 && r.existencias > 0);
  const sinStock = refacciones.filter((r) => r.existencias === 0);
  const pedidosPendientes = pedidos.filter((p) => p.estado === "CRE" || p.estado === "PAG");
  const ultimosPedidos = pedidos.slice(0, 5);

  const ventasMes = stats
    ? (stats.ventas_refacciones?.total ?? 0) + (stats.ventas_servicios?.total ?? 0)
    : 0;
  const ventasRefacciones = stats?.ventas_refacciones?.cantidad ?? 0;
  const ventasServicios = stats?.ventas_servicios?.cantidad ?? 0;

  if (error) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={<AlertTriangle className="h-8 w-8" />}
          title="Error al cargar datos"
          description={error}
          action={
            <Button variant="outline" size="sm" onClick={fetchData}>
              <RefreshCw className="mr-2 h-4 w-4" /> Reintentar
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${dark ? "text-slate-50" : "text-slate-900"}`}>
            Dashboard
          </h1>
          <p className={`mt-0.5 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
            Resumen general de tu negocio
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchData}
          loading={loading}
          className={dark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"}
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Actualizar
        </Button>
      </div>

      {/* KPIs Row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
          </>
        ) : (
          <>
            <KPI
              label="Ventas del mes"
              value={formatCurrency(ventasMes)}
              icon={<DollarSign className="h-5 w-5" />}
              accentColor="emerald"
            />
            <KPI
              label="Pedidos pendientes"
              value={String(pedidosPendientes.length)}
              hint={`de ${data?.pedidosCount ?? 0} totales`}
              icon={<ShoppingCart className="h-5 w-5" />}
              accentColor="amber"
            />
            <KPI
              label="Productos"
              value={String(totalProductos)}
              hint={`${sinStock.length} sin stock`}
              icon={<Package className="h-5 w-5" />}
              accentColor="blue"
            />
            <KPI
              label="Ventas (ref/serv)"
              value={`${ventasRefacciones} / ${ventasServicios}`}
              hint="este mes"
              icon={<TrendingUp className="h-5 w-5" />}
              accentColor="slate"
            />
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Recent Orders — 2 columns wide */}
        <Card
          title="Pedidos recientes"
          description={`${pedidosPendientes.length} pendiente${pedidosPendientes.length !== 1 ? "s" : ""}`}
          right={
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1 ${dark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"}`}
              onClick={() => window.location.assign("/admin/pedidos")}
            >
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          }
          className="xl:col-span-2"
        >
          {loading ? (
            <ListSkeleton rows={5} />
          ) : ultimosPedidos.length === 0 ? (
            <EmptyState
              icon={<ShoppingCart className="h-6 w-6" />}
              title="Sin pedidos"
              description="Los pedidos nuevos aparecerán aquí"
            />
          ) : (
            <div className="space-y-0.5">
              {ultimosPedidos.map((pedido) => {
                const estilo = ESTADO_STYLES[pedido.estado] ?? ESTADO_STYLES.CRE;
                return (
                  <div
                    key={pedido.id}
                    className={`flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors ${
                      dark ? "hover:bg-slate-700/30" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium tabular-nums ${dark ? "text-slate-200" : "text-slate-800"}`}>
                          #{pedido.id}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${dark ? estilo.dark : estilo.light}`}>
                          {ESTADO_LABELS[pedido.estado] ?? pedido.estado}
                        </span>
                      </div>
                      <p className={`mt-0.5 text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                        {pedido.usuario_nombre || pedido.usuario_email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold tabular-nums ${dark ? "text-slate-100" : "text-slate-900"}`}>
                        {formatCurrency(Number(pedido.total))}
                      </p>
                      <p className={`mt-0.5 flex items-center justify-end gap-1 text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
                        <Clock className="h-3 w-3" />
                        {formatDate(pedido.fecha_creacion)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Right Column — Alerts */}
        <div className="space-y-4">
          {/* Stock alerts */}
          <Card
            title="Alertas de stock"
            description={`${stockBajo.length + sinStock.length} producto${stockBajo.length + sinStock.length !== 1 ? "s" : ""}`}
            right={
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1 ${dark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                onClick={() => window.location.assign("/admin/inventario")}
              >
                Inventario <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            }
          >
            {loading ? (
              <ListSkeleton rows={4} />
            ) : stockBajo.length === 0 && sinStock.length === 0 ? (
              <EmptyState
                icon={<Package className="h-6 w-6" />}
                title="Stock saludable"
                description="Todos los productos tienen stock suficiente"
              />
            ) : (
              <div className="space-y-0.5">
                {sinStock.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className={`flex items-center gap-2.5 rounded-lg px-2 py-2 ${
                      dark ? "hover:bg-slate-700/30" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${dark ? "bg-red-500/15" : "bg-red-50"}`}>
                      <AlertTriangle className={`h-3.5 w-3.5 ${dark ? "text-red-400" : "text-red-600"}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm ${dark ? "text-slate-200" : "text-slate-800"}`}>{r.nombre}</p>
                      <p className={`text-[11px] ${dark ? "text-red-400" : "text-red-600"}`}>Sin stock</p>
                    </div>
                  </div>
                ))}
                {stockBajo.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className={`flex items-center gap-2.5 rounded-lg px-2 py-2 ${
                      dark ? "hover:bg-slate-700/30" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${dark ? "bg-amber-500/15" : "bg-amber-50"}`}>
                      <AlertTriangle className={`h-3.5 w-3.5 ${dark ? "text-amber-400" : "text-amber-600"}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm ${dark ? "text-slate-200" : "text-slate-800"}`}>{r.nombre}</p>
                      <p className={`text-[11px] ${dark ? "text-amber-400" : "text-amber-600"}`}>
                        {r.existencias} unidad{r.existencias !== 1 ? "es" : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick stats */}
          <Card title="Resumen rápido">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>Ventas refacciones</span>
                <span className={`text-sm font-semibold tabular-nums ${dark ? "text-slate-100" : "text-slate-900"}`}>
                  {loading ? "..." : formatCurrency(stats?.ventas_refacciones?.total ?? 0)}
                </span>
              </div>
              <div className={`h-px ${dark ? "bg-slate-700/50" : "bg-slate-100"}`} />
              <div className="flex items-center justify-between">
                <span className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>Ventas servicios</span>
                <span className={`text-sm font-semibold tabular-nums ${dark ? "text-slate-100" : "text-slate-900"}`}>
                  {loading ? "..." : formatCurrency(stats?.ventas_servicios?.total ?? 0)}
                </span>
              </div>
              <div className={`h-px ${dark ? "bg-slate-700/50" : "bg-slate-100"}`} />
              <div className="flex items-center justify-between">
                <span className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>Devoluciones</span>
                <span className={`text-sm font-semibold tabular-nums ${dark ? "text-red-400" : "text-red-600"}`}>
                  {loading ? "..." : formatCurrency(stats?.devoluciones?.total ?? 0)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
