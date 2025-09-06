export interface Service {
    noDeServicio: number | string
    fecha: string
    aparato: string
    telefono: string
    cliente: string
    observaciones?: string
    estado: "Pendiente" | "En Proceso" | "Reparado" | "Entregado" | "Cancelado" | "Revision"
    marca: string
}

export type ServiceActionState = {
    success?: boolean
    message?: string
    id?: string
    fieldErrors?: Partial<Record<keyof Service, string>>
}


