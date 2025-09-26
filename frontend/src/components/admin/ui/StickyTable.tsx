"use client";
import React from "react";
import type { TableColumn } from "@/components/admin/utils";
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme";

export const StickyTable = <T extends Record<string, any>>({
  columns,
  rows,
  keyField,
  onRowAction,
  selectable = false,
  selectedKeys = [],
  onToggleSelect,
  onToggleSelectAll,
  actions,
  className = "",
}: {
  columns: TableColumn<T>[];
  rows: T[];
  keyField: keyof T | string;
  onRowAction?: (action: string, row: T) => void;
  selectable?: boolean;
  selectedKeys?: Array<string | number>;
  onToggleSelect?: (key: string | number) => void;
  onToggleSelectAll?: () => void;
  actions?: Array<{ key: string; label: string; icon?: React.ReactNode | React.ComponentType<any> }>;
  className?: string;
}) => {
  const { dark } = useAdminTheme();
  const allSelected = selectable && rows.length > 0 && selectedKeys && selectedKeys.length === rows.length;
  return (
    <div className={`overflow-auto rounded-2xl border ${dark ? "border-white/10" : "border-black/10"} ${className}`}>
      <table className="min-w-full text-sm">
        <thead className={`sticky top-0 z-10 ${dark ? "bg-[#0F172A]" : "bg-white"}`}>
          <tr className={`border-b ${dark ? "border-white/10 text-gray-300" : "border-black/10 text-gray-700"}`}>
            {selectable && (
              <th scope="col" className="px-3 py-3 text-left">
                <input type="checkbox" aria-label="Seleccionar todos" checked={allSelected}
                       onChange={onToggleSelectAll} className={`h-4 w-4 rounded ${dark ? "border-white/20 bg-white/5" : "border-black/20 bg-white"}`} />
              </th>
            )}
            {columns.map((c) => (
              <th key={String(c.key)} scope="col" className={`px-3 py-3 font-medium ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"}` } style={{ width: c.width }}>
                <div className="inline-flex items-center gap-1">
                  <span className={`${dark ? "text-gray-400" : "text-gray-900"}`}>{c.header}</span>
                </div>
              </th>
            ))}
            {actions && <th className="px-3 py-3 text-right">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const key = (row as any)[keyField];
            return (
              <tr key={String(key)} className={`border-b ${dark ? "border-white/5 hover:bg-white/5" : "border-black/5 hover:bg-black/5"}`}>
                {selectable && (
                  <td className="px-3 py-2">
                    <input type="checkbox" aria-label={`Seleccionar fila ${idx + 1}`} checked={selectedKeys?.includes(key)}
                           onChange={() => onToggleSelect && onToggleSelect(key)} className={`h-4 w-4 rounded ${dark ? "border-white/20 bg-white/5" : "border-black/20 bg-white"}`} />
                  </td>
                )}
                {columns.map((c) => (
                  <td key={String(c.key)} className={`px-3 py-2 ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"} ${dark ? "text-gray-400" : "text-gray-900"}`}>
                    {c.render ? c.render(row) : String((row as any)[c.key])}
                  </td>
                ))}
                {actions && (
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-1">
                      {actions.map((a) => {
                        const iconCandidate: any = a.icon;
                        let renderedIcon: React.ReactNode = <span className="inline-block h-4 w-4" />;
                        if (iconCandidate) {
                          if (React.isValidElement(iconCandidate)) {
                            renderedIcon = iconCandidate;
                          } else if (typeof iconCandidate !== "string") {
                            const Comp = iconCandidate as React.ComponentType<any>;
                            renderedIcon = <Comp className="h-4 w-4" />;
                          }
                        }
                        return (
                          <button key={a.key} className={`rounded-sm p-1 ${dark ? "text-gray-300 hover:bg-white/10" : "text-gray-700 hover:bg-black/5"}`} onClick={() => onRowAction && onRowAction(a.key, row)} aria-label={a.label}>
                            {renderedIcon}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
