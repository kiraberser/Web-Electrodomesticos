"use client";
import React, { useMemo, useState } from "react";
import { Button } from "@/features/admin/ui/Button";
import { Input } from "@/features/admin/ui/Input";
import { Select } from "@/features/admin/ui/Select";
import { Card } from "@/features/admin/ui/Card";
import { StickyTable } from "@/features/admin/ui/StickyTable";
import { Modal } from "@/features/admin/ui/Modal";
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme";

import type { ProductRow, TableColumn } from "@/features/admin/utils/types";
import { formatCurrency } from "@/features/admin/utils/format";

export const ProductosSection: React.FC<{ onToastAction: (t: { type?: "success" | "error" | "info"; title: string; description?: string }) => void }>
  = ({ onToastAction }) => {
  const { dark } = useAdminTheme();
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [estado, setEstado] = useState("Todos");
  const [openEditor, setOpenEditor] = useState(false);
  const [editorTab, setEditorTab] = useState<"General" | "Inventario" | "SEO" | "Media">("General");

  const rows = useMemo<ProductRow[]>(() => (
    [
      { id: "P-001", nombre: "Laptop Pro 14", sku: "LP14-2025", precio: 24999, stock: 12, estado: "Activo", categoria: "Laptops" },
      { id: "P-002", nombre: "SSD NVMe 1TB", sku: "SSD1TB-PCIe4", precio: 1899, stock: 4, estado: "Activo", categoria: "Almacenamiento" },
      { id: "P-003", nombre: "Teclado Mecánico", sku: "KB-RED-87", precio: 1299, stock: 0, estado: "Borrador", categoria: "Periféricos" },
    ]
  ), []);

  const filtered = useMemo(() => rows.filter((r) => {
    const matchesQuery = [r.nombre, r.sku, r.categoria].join(" ").toLowerCase().includes(query.toLowerCase());
    const matchesCat = categoria === "Todas" || r.categoria === categoria;
    const matchesEstado = estado === "Todos" || r.estado === estado;
    return matchesQuery && matchesCat && matchesEstado;
  }), [rows, query, categoria, estado]);

  const columns: TableColumn<ProductRow>[] = [
    { key: "imagen", header: "", width: "54px", render: () => <div className={`h-9 w-9 rounded-lg ${dark ? "bg-white/10" : "bg-black/5"}`} /> },
    { key: "nombre", header: "Nombre", render: (r) => (
      <div className="min-w-[220px]">
        <div className={`font-medium ${dark ? "text-gray-400" : "text-gray-900"}`}>{r.nombre}</div>
        <div className={`text-xs ${dark ? "text-gray-400" : "text-gray-600"}`}>SKU: {r.sku}</div>
      </div>
    ) },
    { key: "precio", header: "Precio", align: "right", render: (r) => formatCurrency(r.precio) },
    { key: "stock", header: "Stock", align: "center", render: (r) => (
      <span className={`${r.stock <= 3 ? (dark ? "text-amber-300" : "text-amber-700") : (dark ? "text-gray-200" : "text-gray-800")}`}>{r.stock}</span>
    ) },
    { key: "estado", header: "Estado", render: (r) => (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
        r.estado === "Activo"
          ? (dark ? "bg-emerald-600/20 text-emerald-300" : "bg-emerald-100 text-emerald-700")
          : (dark ? "bg-white/10 text-gray-300" : "bg-black/5 text-gray-700")
      }`}>{r.estado}</span>
    ) },
    { key: "categoria", header: "Categoría" },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar productos" aria-label="Buscar productos" />
        <Select value={categoria} onChange={(e) => setCategoria(e.target.value)} aria-label="Filtrar por categoría">
          <option>Todas</option>
          <option>Laptops</option>
          <option>Almacenamiento</option>
          <option>Periféricos</option>
        </Select>
        <Select value={estado} onChange={(e) => setEstado(e.target.value)} aria-label="Filtrar por estado">
          <option>Todos</option>
          <option>Activo</option>
          <option>Borrador</option>
        </Select>
        <div className="flex items-center gap-2">
          <Button className="w-full gap-2" onClick={() => setOpenEditor(true)}>
            Nuevo producto
          </Button>
          <Button variant="outline" className="w-12" aria-label="Filtros avanzados">
            ⚙️
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {filtered.map((p) => (
          <Card key={p.id}>
            <div className={`h-24 w-full rounded-xl ${dark ? "bg-white/10" : "bg-black/5"}`} />
            <div className={`mt-2 text-sm font-medium ${dark ? "text-gray-100" : "text-gray-900"}`}>{p.nombre}</div>
            <div className={`text-xs ${dark ? "text-gray-400" : "text-gray-600"}`}>{formatCurrency(p.precio)} • Stock {p.stock}</div>
          </Card>
        ))}
      </div>

      <StickyTable<ProductRow>
        columns={columns}
        rows={filtered}
        keyField="id"
        actions={[{ key: "editar", label: "Editar" }, { key: "borrar", label: "Eliminar" }]}
        onRowAction={(k, row) => {
          if (k === "editar") setOpenEditor(true);
          if (k === "borrar") onToastAction({ type: "success", title: "Producto eliminado", description: row.nombre });
        }}
      />

      <Modal open={openEditor} onClose={() => setOpenEditor(false)} title="Crear/Editar producto" wide>
        <div className="flex flex-wrap items-center gap-2">
          {["General", "Inventario", "SEO", "Media"].map((tab) => (
            <button key={tab} onClick={() => setEditorTab(tab as "General" | "Inventario" | "SEO" | "Media")} className={`rounded-xl px-3 py-1.5 text-sm ${
              editorTab === tab ? (dark ? "bg-white/10 text-white" : "bg-black/5 text-gray-900") : (dark ? "hover:bg-white/5 text-gray-200" : "hover:bg-black/5 text-gray-800")
            }`}>{tab}</button>
          ))}
        </div>
        <div className="mt-3 space-y-3">
          {editorTab === "General" && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input label="Nombre" placeholder="Nombre del producto" />
              <Input label="SKU" placeholder="SKU" />
              <Input label="Precio" type="number" placeholder="0.00" />
              <Select label="Categoría"><option>Laptops</option><option>Almacenamiento</option><option>Periféricos</option></Select>
            </div>
          )}
          {editorTab === "Inventario" && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input label="Stock" type="number" />
              <Input label="Stock mínimo" type="number" />
            </div>
          )}
          {editorTab === "SEO" && (
            <div className="grid grid-cols-1 gap-3">
              <Input label="Slug" placeholder="url-amigable" />
              <Input label="Meta título" />
              <Input label="Meta descripción" />
            </div>
          )}
          {editorTab === "Media" && (
            <div className="space-y-2">
              <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}>Imágenes</p>
              <div className="flex flex-wrap gap-2">
                <div className={`h-20 w-20 rounded-lg ${dark ? "bg-white/10" : "bg-black/5"}`} />
                <div className={`h-20 w-20 rounded-lg ${dark ? "bg-white/10" : "bg-black/5"}`} />
                <div className={`h-20 w-20 rounded-lg ${dark ? "bg-white/10" : "bg-black/5"}`} />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenEditor(false)}>Cancelar</Button>
            <Button onClick={() => { setOpenEditor(false); onToastAction({ type: "success", title: "Producto guardado" }); }}>Guardar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
