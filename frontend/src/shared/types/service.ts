export interface Service {
    noDeServicio: number | string
    fecha: string
    aparato: string
    telefono: string
    cliente: string
    observaciones?: string
    estado: "Pendiente" | "En Proceso" | "Reparado" | "Entregado" | "Cancelado" | "Revision" | string
    marca: string
}

export type ServiceActionState = {
    success?: boolean
    message?: string
    id?: string
    fieldErrors?: Partial<Record<keyof Service, string>>
}

export interface ServiceDetail {
    noDeServicio: number
    fecha: string
    aparato: string
    telefono: string
    cliente: string
    observaciones: string
    estado: "Pendiente" | "En Proceso" | "Reparado" | "Entregado" | "Cancelado"
    marca: string // Changed to string to match Service type
    // Additional details
    fechaEntrega?: string
    costoManoObra?: number
    costoRefacciones?: number
    costoTotal?: number
    tecnico?: string
    prioridad?: "Baja" | "Media" | "Alta" | "Urgente"
    garantia?: number // days
    metodoPago?: string
    estadoPago?: "Pendiente" | "Pagado" | "Parcial"
}

export interface CostNote {
    id?: number
    serviceNumber: number
    clientName: string
    deviceName: string
    laborCost: number
    partsCost: number
    totalCost: number
    deliveryDate: string
    notes: string
    createdAt: string
    updatedAt: string
    parts: { name: string; quantity: number; price: number; total: number }[]
    paymentStatus?: string
    technician?: string
    warranty?: number
}

// Representation used in the Admin services list (SSR page table)
// Matches what that page expects today
export interface AdminServicePageItem {
    noDeServicio: number
    fecha: string
    aparato: string
    telefono: string
    cliente: string
    observaciones: string
    estado: "Pendiente" | "En Proceso" | "Reparado" | "Entregado" | "Cancelado"
    marca: number
}

export interface PaginationInfo {
    count: number
    next: string | null
    previous: string | null
    currentPage: number
    totalPages: number
    pageSize: number
}