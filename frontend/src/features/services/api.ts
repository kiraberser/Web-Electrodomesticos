'use server'

import axios from "axios";
import { cookies } from "next/headers";
import { Service } from "@/shared/types/service";

const URL = process.env.NEXT_PUBLIC_BASE_URL_API

// ── Estadísticas ──────────────────────────────────────────────────────────────

export interface ServiciosEstadisticas {
    total: number
    pendientes: number
    completados: number
    tasa_completado: number
    por_estado: Record<string, number>
    por_aparato: { aparato: string; count: number }[]
    por_marca:   { marca:   string; count: number }[]
    tendencia_semanal: { semana: string; count: number }[]
}

export const getServiciosEstadisticas = async (): Promise<ServiciosEstadisticas> => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    const res = await fetch(`${URL}/servicios/estadisticas/`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store',
    })
    if (!res.ok) throw new Error('Failed to fetch servicios estadisticas')
    return res.json()
}

// ── CRUD ─────────────────────────────────────────────────────────────────────

export const getAllServices = async (page: number = 1, pageSize: number = 10, search?: string) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value

    const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
    })
    if (search) params.append('search', search)

    const url = `${URL}/servicios/?${params.toString()}`
    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
    })

    if (!res.ok) throw new Error('Failed to fetch services')
    const data = await res.json()

    return {
        data: data.results,
        success: true,
        status: res.status,
        pagination: {
            count: data.count,
            next: data.next,
            previous: data.previous,
            currentPage: page,
            totalPages: Math.ceil(data.count / pageSize),
            pageSize,
        },
    }
}

export const createService = async (serviceData: Service) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    const response = await axios.post(`${URL}/servicios/nuevo/`, serviceData, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    });

    if (response.status !== 201) {
        throw new Error('Failed to create service');
    }

    return { data: response.data, status: response.status };
};

export const getServiceById = async (id: string) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    const response = await axios.get(`${URL}/servicios/${id}/`, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    });
    if (response.status !== 200) {
        throw new Error('Failed to fetch service');
    }
    return { data: response.data, status: response.status };
}

export const updateServiceNote = async (id: string, note: Record<string, unknown>) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    const response = await axios.patch(`${URL}/servicios/${id}/`, { nota: note }, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    });
    if (response.status !== 200) {
        throw new Error('Failed to update service note');
    }
    return { data: response.data, status: response.status };
}

export const updateService = async (serviceData: Service) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    await axios.put(`${URL}/servicios/${serviceData.noDeServicio}/`, serviceData, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    });
}

export const deleteService = async (id: string) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    const response = await axios.delete(`${URL}/servicios/${id}/`, {
        headers: {
            "Content-type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    });
    if (response.status !== 204) {
        throw new Error('Failed to delete service');
    }
}

// Create a sale record for a service note (VentasServicios)
export const createServiceSale = async (payload: {
    servicio: number
    mano_obra: number
    refacciones_total: number
    total?: number
    observaciones?: string
    tecnico?: string
    garantia_dias?: number
    estado_pago?: 'Pendiente' | 'Parcial' | 'Pagado'
}) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    const response = await axios.post(`${URL}/ventas/registros-servicios/`, payload, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    });

    if (response.status !== 201 && response.status !== 200) {
        throw new Error('Failed to create service sale');
    }

    return { data: response.data, status: response.status };
}

export const patchServiceFields = async (id: string, fields: Record<string, unknown>) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    const res = await axios.patch(`${URL}/servicios/${id}/`, fields, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    })
    if (res.status !== 200) throw new Error('Failed to patch service')
    return { data: res.data }
}

export const getServiceSaleByService = async (servicioId: string) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    const response = await axios.get(`${URL}/ventas/registros-servicios/?servicio=${servicioId}`, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    });

    if (response.status !== 200) {
        throw new Error('Failed to fetch service sale')
    }

    return { data: response.data, status: response.status }
}