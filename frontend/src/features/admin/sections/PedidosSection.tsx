"use client";
import React, { useMemo, useState } from "react";
import { Chip } from "@/features/admin/ui/Chip";
import { Button } from "@/features/admin/ui/Button";
import { StickyTable } from "@/features/admin/ui/StickyTable";
import { Modal } from "@/features/admin/ui/Modal";
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme";

import type { OrderRow, OrderStatus, TableColumn } from "@/features/admin/utils/types";
import { formatCurrency, formatDate } from "@/features/admin/utils/format";
import { exportRowsToCsv } from "@/features/admin/utils/exportCsv";
import { EyeIcon, PencilIcon } from "lucide-react";

export const PedidosSection: React.FC<{ onToastAction: (t: { type?: "success" | "error" | "info"; title: string; description?: string }) => void }>
  = ({ onToastAction }) => {
  const { dark } = useAdminTheme();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "Todos">("Todos");
  const [selected, setSelected] = useState<Array<string>>([]);
  const [detail, setDetail] = useState<OrderRow | null>(null);

  const rows = useMemo<OrderRow[]>(() => (
    [
      { id: "1042", cliente: "Juan Pérez", estado: "Pendiente", total: 1540, metodoPago: "Tarjeta", fecha: new Date().toISOString() },
      { id: "1041", cliente: "Ana Gómez", estado: "Pagado", total: 2600, metodoPago: "Paypal", fecha: new Date().toISOString() },
      { id: "1040", cliente: "Carlos Ruiz", estado: "Enviado", total: 980, metodoPago: "OXXO", fecha: new Date().toISOString() },
      { id: "1039", cliente: "María López", estado: "Cancelado", total: 0, metodoPago: "Transferencia", fecha: new Date().toISOString() },
      { id: "1038", cliente: "Ricardo Díaz", estado: "Pagado", total: 4380, metodoPago: "Tarjeta", fecha: new Date().toISOString() },
    ]
  ), []);

  const filtered = useMemo(() => rows.filter((r) => statusFilter === "Todos" ? true : r.estado === statusFilter), [rows, statusFilter]);

  const columns: TableColumn<OrderRow>[] = [
    { key: "id", header: "ID", width: "120px", render: (r) => <span className="font-mono">#{r.id}</span> },
    { key: "cliente", header: "Cliente" },
    { key: "estado", header: "Estado", render: (r) => (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
        r.estado === "Pagado" ? (dark ? "bg-emerald-900/20 text-emerald-300" : "bg-emerald-100 text-emerald-700") :
        r.estado === "Enviado" ? (dark ? "bg-sky-900/20 text-sky-300" : "bg-sky-100 text-sky-700") :
        r.estado === "Pendiente" ? (dark ? "bg-amber-900/20 text-amber-300" : "bg-amber-100 text-amber-700") : (dark ? "bg-red-600/20 text-red-300" : "bg-red-100 text-red-700")
      }`}>{r.estado}</span>
    ) },
    { key: "total", header: "Total", align: "right", render: (r) => formatCurrency(r.total) },
    { key: "metodoPago", header: "Método de pago" },
    { key: "fecha", header: "Fecha", render: (r) => formatDate(r.fecha) },
  ];

  const toggleSelect = (key: string | number) => {
    setSelected((prev) => prev.includes(String(key)) ? prev.filter((k) => k !== String(key)) : [...prev, String(key)]);
  };
  const toggleSelectAll = () => {
    setSelected((prev) => prev.length === filtered.length ? [] : filtered.map((r) => r.id));
  };

  const onBulk = (action: string) => {
    if (selected.length === 0) return;
    if (action === "export") {
      exportRowsToCsv(filtered.filter((r) => selected.includes(r.id)), "pedidos.csv");
      onToastAction({ type: "success", title: `Exportado ${selected.length} pedidos` });
    } else if (action === "estado") {
      onToastAction({ type: "success", title: "Estado actualizado", description: `Pedidos: ${selected.join(", ")}` });
    } else if (action === "print") {
      window.print();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Chip selected={statusFilter === "Todos"} onClick={() => setStatusFilter("Todos")}>Todos</Chip>
        <Chip color="warning" selected={statusFilter === "Pendiente"} onClick={() => setStatusFilter("Pendiente")}>Pendiente</Chip>
        <Chip color="success" selected={statusFilter === "Pagado"} onClick={() => setStatusFilter("Pagado")}>Pagado</Chip>
        <Chip color="info" selected={statusFilter === "Enviado"} onClick={() => setStatusFilter("Enviado")}>Enviado</Chip>
        <Chip color="danger" selected={statusFilter === "Cancelado"} onClick={() => setStatusFilter("Cancelado")}>Cancelado</Chip>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline"  onClick={() => onBulk("estado")} className={`${dark ? "text-gray-200" : "text-gray-800"} gap-2`}>Cambiar estado</Button>
          <Button variant="outline"  onClick={() => onBulk("export")} className={`${dark ? "text-gray-200" : "text-gray-800"} gap-2`}>Exportar CSV</Button>
          <Button variant="outline"  onClick={() => onBulk("print")} className={`${dark ? "text-gray-200" : "text-gray-800"} gap-2`}>Imprimir</Button>
        </div>
      </div>

      <StickyTable<OrderRow>
        columns={columns}
        rows={filtered}
        keyField="id"
        selectable
        selectedKeys={selected}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        actions={[{ key: "ver", label: "Ver", icon: <EyeIcon />}, { key: "editar", label: "Editar", icon: <PencilIcon />}]}
        onRowAction={(k, row) => {
          if (k === "ver") setDetail(row);
          if (k === "editar") onToastAction({ type: "info", title: "Editar pedido", description: `#${row.id}` });
        }}
      />

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail ? `Pedido #${detail.id}` : undefined} wide>
        {detail && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4"><p className="text-sm">{detail.estado}</p></div>
              <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4"><p className="text-sm">{detail.cliente}</p></div>
              <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4"><p className="text-sm">{formatCurrency(detail.total)}</p></div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4">
              <ol className="space-y-2 text-sm">
                <li>Creado</li>
                <li>Pagado</li>
                <li>Enviado</li>
              </ol>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4"><p className="text-sm text-gray-300">Av. Ejemplo 123, CDMX</p></div>
            <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4"><input className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-gray-100" placeholder="Agregar nota" /></div>
          </div>
        )}
      </Modal>
    </div>
  );
};
