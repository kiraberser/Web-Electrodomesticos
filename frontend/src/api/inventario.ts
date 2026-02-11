'use server'

import axios from "axios"
import { cookies } from "next/headers"
import { cache } from "react"

const URL = process.env.NEXT_PUBLIC_BASE_URL_API

// Types
export interface MovimientoInventario {
    id: number
    refaccion: number
    refaccion_nombre: string
    cantidad: number
    precio_unitario: number
    marca: string | null
    categoria: string | null
    tipo_movimiento: 'ENT' | 'SAL'
    fecha: string
    observaciones: string
}

export interface MovimientoFilters {
    search?: string
    tipo_movimiento?: 'ENT' | 'SAL'
    ordering?: string
    refaccion?: number
    page?: number
    fecha_gte?: string
    fecha_lte?: string
}

export interface PaginatedMovimientos {
    results: MovimientoInventario[]
    count: number
}

// Helper para obtener token (cached per-request)
const getAuthHeaders = cache(async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }
})

// ========== MOVIMIENTOS ==========

export const getMovimientos = async (filters?: MovimientoFilters): Promise<PaginatedMovimientos> => {
    const headers = await getAuthHeaders()
    const params = new URLSearchParams()
    if (filters?.search) params.append('search', filters.search)
    if (filters?.tipo_movimiento) params.append('tipo_movimiento', filters.tipo_movimiento)
    if (filters?.ordering) params.append('ordering', filters.ordering)
    if (filters?.refaccion) params.append('refaccion', String(filters.refaccion))
    if (filters?.page) params.append('page', String(filters.page))
    if (filters?.fecha_gte) params.append('fecha__gte', filters.fecha_gte)
    if (filters?.fecha_lte) params.append('fecha__lte', filters.fecha_lte)

    const url = `${URL}/inventario/refacciones/${params.toString() ? '?' + params.toString() : ''}`
    const response = await fetch(url, {
        headers,
        next: { revalidate: 10 },
    })

    if (!response.ok) throw new Error('Failed to fetch movimientos')
    const data = await response.json()
    return {
        results: data.results || data,
        count: data.count ?? (data.results || data).length,
    }
}

export const getMovimiento = async (id: number) => {
    const headers = await getAuthHeaders()
    const response = await axios.get(`${URL}/inventario/refaccion/${id}/`, { headers })

    if (response.status !== 200) {
        throw new Error('Failed to fetch movimiento')
    }

    return response.data
}

// ========== REGISTRAR MOVIMIENTOS ==========

export const registrarEntrada = async (data: { refaccion: number; cantidad: number; precio_unitario?: number; observaciones?: string }) => {
    const headers = await getAuthHeaders()
    const response = await axios.post(`${URL}/inventario/entrada/`, data, { headers })

    if (response.status !== 201) {
        throw new Error('Failed to registrar entrada')
    }

    return { data: response.data, status: response.status }
}

export const registrarSalida = async (data: { refaccion: number; cantidad: number }) => {
    const headers = await getAuthHeaders()
    const response = await axios.post(`${URL}/inventario/salida/`, data, { headers })

    if (response.status !== 201) {
        throw new Error('Failed to registrar salida')
    }

    return { data: response.data, status: response.status }
}

export const registrarDevolucion = async (data: {
    refaccion: number
    cantidad: number
    precio_unitario?: number
    venta_id?: number
    motivo?: string
    observaciones?: string
}) => {
    const headers = await getAuthHeaders()
    const response = await axios.post(`${URL}/inventario/devolucion/`, data, { headers })

    if (response.status !== 201) {
        throw new Error('Failed to registrar devolucion')
    }

    return { data: response.data, status: response.status }
}
