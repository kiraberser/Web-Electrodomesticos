"use client";

import React from "react";
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme";
import { OverviewSection, ProductosSection, AjustesSection, PedidosSection } from "@/components/admin/sections";

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


