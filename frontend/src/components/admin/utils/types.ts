import type { ComponentType } from "react";

export type SectionKey =
  | "overview"
  | "pedidos"
  | "ventas"
  | "servicios"
  | "productos"
  | "blog"
  | "inventario"
  | "dashboard";

export type DateRange = {
  from: string; // ISO
  to: string;   // ISO
};

export type TableColumn<T> = {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
};

export type OrderStatus = "Pendiente" | "Pagado" | "Enviado" | "Cancelado";

export type OrderRow = {
  id: string;
  cliente: string;
  estado: OrderStatus;
  total: number;
  metodoPago: "Tarjeta" | "Transferencia" | "OXXO" | "Paypal";
  fecha: string; // ISO
};

export type ProductRow = {
  id: string;
  nombre: string;
  sku: string;
  precio: number;
  stock: number;
  estado: "Activo" | "Borrador";
  categoria: string;
  imagen?: string;
};

export type NavItem = { key: SectionKey; label: string; icon: ComponentType<Record<string, unknown>> };
