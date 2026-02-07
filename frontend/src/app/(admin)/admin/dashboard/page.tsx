"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme";

const OverviewSection = dynamic(() => import("@/components/admin/sections/OverviewSection").then(m => ({ default: m.OverviewSection })));
const ProductosSection = dynamic(() => import("@/components/admin/sections/ProductosSection").then(m => ({ default: m.ProductosSection })));
const AjustesSection = dynamic(() => import("@/components/admin/sections/AjustesSection").then(m => ({ default: m.AjustesSection })));
const PedidosSection = dynamic(() => import("@/components/admin/sections/PedidosSection").then(m => ({ default: m.PedidosSection })));

type LocalSection = "overview" | "productos" | "ajustes" | "pedidos";

export default function DashboardPage() {
  const [section, setSection] = React.useState<LocalSection>("overview");
  const { dark } = useAdminTheme();

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          className={`rounded px-3 py-1 text-sm ${section === "overview" ? (dark ? "bg-white/10 text-white" : "bg-black/5 text-gray-900") : (dark ? "bg-white/5 text-gray-200" : "bg-black/5 text-gray-800")}`}
          onClick={() => setSection("overview")}
        >
          Overview
        </button>
        <button
          className={`rounded px-3 py-1 text-sm ${section === "productos" ? (dark ? "bg-white/10 text-white" : "bg-black/5 text-gray-900") : (dark ? "bg-white/5 text-gray-200" : "bg-black/5 text-gray-800")}`}
          onClick={() => setSection("productos")}
        >
          Productos
        </button>
        <button
          className={`rounded px-3 py-1 text-sm ${section === "ajustes" ? (dark ? "bg-white/10 text-white" : "bg-black/5 text-gray-900") : (dark ? "bg-white/5 text-gray-200" : "bg-black/5 text-gray-800")}`}
          onClick={() => setSection("ajustes")}
        >
          Ajustes
        </button>
        <button
          className={`rounded px-3 py-1 text-sm ${section === "pedidos" ? (dark ? "bg-white/10 text-white" : "bg-black/5 text-gray-900") : (dark ? "bg-white/5 text-gray-200" : "bg-black/5 text-gray-800")}`}
          onClick={() => setSection("pedidos")}
        >
          Pedidos
        </button>
      </div>

      {section === "overview" && <OverviewSection />}
      {section === "productos" && (
        <ProductosSection onToastAction={() => {}} />
      )}
      {section === "ajustes" && (
        <AjustesSection onToastAction={() => {}} onToggleThemeAction={() => {}} dark={true} />
      )}
      {section === "pedidos" && (
        <PedidosSection onToastAction={() => {}} />
      )}
    </div>
  );
}


