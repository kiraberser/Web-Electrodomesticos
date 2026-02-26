'use server'

import axios from 'axios';
import { getToken } from '@/shared/lib/utilscookies';
import type { Refaccion } from '@/features/catalog/api';

const url = process.env.NEXT_PUBLIC_BASE_URL_API;

export interface VentaRefaccion {
    id: number;
    tipo: 'refaccion';
    usuario_username: string;
    refaccion_nombre: string;
    marca_nombre: string;
    cantidad: number;
    precio_unitario: string;
    total: string;
    fecha_venta: string;
    fecha: string;
}

export interface VentaServicio {
    id: number;
    tipo: 'servicio';
    servicio: number;
    servicio_aparato: string;
    mano_obra: string;
    refacciones_total: string;
    total: string;
    fecha_venta: string;
    observaciones?: string;
    tecnico?: string;
    garantia_dias: number;
    estado_pago: 'Pendiente' | 'Parcial' | 'Pagado';
    fecha: string;
}

export interface Devolucion {
    id: number;
    tipo: 'devolucion';
    venta_id?: number;
    refaccion_nombre: string;
    marca_nombre: string;
    cantidad: number;
    precio_unitario: string;
    total: string;
    motivo?: string;
    fecha_devolucion: string;
    fecha: string;
}

export type Venta = VentaRefaccion | VentaServicio | Devolucion;

export interface VentasResponse {
    results: Venta[];
    count: number;
    next: string | null;
    previous: string | null;
}

export interface PaginatedVentasResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Venta[];
}

export interface EstadisticasVentas {
    ventas_servicios: {
        total: number;
        cantidad: number;
    };
    ventas_refacciones: {
        total: number;
        cantidad: number;
    };
    devoluciones: {
        total: number;
        cantidad: number;
    };
}

export interface GraficoVentasData {
    mes: string;
    fecha: string;
    ventas_refacciones: number;
    ventas_servicios: number;
    devoluciones: number;
    total: number;
}

export interface GraficoVentasResponse {
    datos: GraficoVentasData[];
}

/**
 * Obtiene todas las ventas (refacciones, servicios y devoluciones) con paginación y filtros
 */
export const getAllVentas = async (
    page: number = 1,
    tipo?: string,
    search?: string
): Promise<PaginatedVentasResponse> => {
    try {
        const params: Record<string, string | number> = { page };
        if (tipo) params.tipo = tipo;
        if (search) params.search = search;
        
        const response = await axios.get(
            `${url}/ventas/all/`,
            { 
                params,
                headers: { Authorization: `Bearer ${await getToken()}` } 
            }
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("❌ Error al obtener ventas:", error.response.data);
        } else {
            console.error("Error desconocido:", error);
        }
        throw error;
    }
};

/**
 * Obtiene estadísticas agregadas de ventas
 * @param tipo - 'dia' para el día actual, 'mes' para el mes especificado, 'año' para el año especificado
 * @param año - Año a consultar (default: año actual)
 * @param mes - Mes a consultar cuando tipo='mes' o tipo='dia' (default: mes actual)
 */
export const getEstadisticasVentas = async (
    tipo: 'dia' | 'mes' | 'año' = 'mes',
    año?: number,
    mes?: number,
    dia?: number
): Promise<EstadisticasVentas & { tipo: string; año: number; mes?: number }> => {
    try {
        const params: Record<string, string | number> = { tipo };
        if (año) params.año = año;
        if (mes) params.mes = mes;
        if (dia && tipo === 'dia') params.dia = dia;
        
        const response = await axios.get(
            `${url}/ventas/all/estadisticas/`,
            { 
                params,
                headers: { Authorization: `Bearer ${await getToken()}` } 
            }
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("❌ Error al obtener estadísticas de ventas:", error.response.data);
        } else {
            console.error("Error desconocido:", error);
        }
        throw error;
    }
};

/**
 * Obtiene datos para el gráfico de ventas
 * @param tipo - 'dia' para ver por día dentro de un mes, 'mes' para ver por mes dentro de un año
 * @param año - Año a consultar (default: año actual)
 * @param mes - Mes a consultar cuando tipo='dia' (default: mes actual)
 */
// ─── POS ────────────────────────────────────────────────────────────────────

export interface CreateVentaPayload {
    refaccion: number
    cantidad: number
    precio_unitario: number
}

export interface VentaCreada {
    id: number
    total: string
    refaccion_nombre: string
}

/** Busca refacciones por nombre para el POS (requiere token de admin) */
export const searchRefaccionesForPOS = async (query: string): Promise<Refaccion[]> => {
    try {
        const response = await axios.get(`${url}/productos/refacciones/`, {
            params: { search: query, page_size: 20 },
            headers: { Authorization: `Bearer ${await getToken()}` },
        })
        const data = response.data
        return data.results ?? data
    } catch (error: unknown) {
        console.error('Error buscando refacciones:', error)
        return []
    }
}

/** Crea un registro de venta de refacción (POS) */
export const createVentaRefaccion = async (payload: CreateVentaPayload): Promise<VentaCreada> => {
    const response = await axios.post(
        `${url}/ventas/registros-ventas/`,
        payload,
        { headers: { Authorization: `Bearer ${await getToken()}` } },
    )
    return response.data
}

// ─── GRÁFICO ─────────────────────────────────────────────────────────────────

export const getGraficoVentas = async (
    tipo: 'dia' | 'mes' = 'dia',
    año?: number,
    mes?: number
): Promise<GraficoVentasResponse & { tipo: string; año: number; mes?: number }> => {
    try {
        const params: Record<string, string | number> = { tipo };
        if (año) params.año = año;
        if (mes) params.mes = mes;
        
        const response = await axios.get(
            `${url}/ventas/all/grafico/`,
            { 
                params,
                headers: { Authorization: `Bearer ${await getToken()}` } 
            }
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("❌ Error al obtener datos del gráfico:", error.response.data);
        } else {
            console.error("Error desconocido:", error);
        }
        throw error;
    }
};

