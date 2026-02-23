'use server'

import axios from 'axios';
import { cookies } from 'next/headers';

export interface CheckoutItem {
    refaccion: number;
    cantidad: number;
}

export interface CheckoutResponse {
    pedido_id: number;
    total: string;
    estado: string;
}

export interface PedidoItem {
    id: number;
    refaccion: number;
    refaccion_nombre: string;
    refaccion_imagen?: string | null;
    cantidad: number;
    precio_unitario: string;
    subtotal: string;
}

export interface Pedido {
    id: number;
    estado: string;
    total: string;
    fecha_creacion: string;
    items: PedidoItem[];
    usuario_nombre: string;
    usuario_email: string;
    metodo_pago: string;
    metodo_pago_display?: string;
    pago_id?: number | null;
    pago_status?: string | null;
    pago_status_display?: string | null;
    pago_status_detail?: string | null;
    pago_payment_id?: string | null;
    pago_fecha_creacion?: string | null;
    pago_fecha_aprobacion?: string | null;
}

export interface PaginatedPedidosResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Pedido[];
}

const url = process.env.NEXT_PUBLIC_BASE_URL_API;

export const crearPedido = async (items: CheckoutItem[]): Promise<CheckoutResponse> => {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('access_cookie')?.value
        const response = await axios.post(
            `${url}/pedidos/checkout/`,
            { items },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            
            console.error("❌ Error de validación del Backend:", error.response.data);
        } else {
            console.error("Error desconocido:", error);
        }
        throw error; 
    }
}

/**
 * Obtiene todos los pedidos (solo para administradores) con paginación
 */
export const getAllPedidos = async (page: number = 1): Promise<PaginatedPedidosResponse> => {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('access_cookie')?.value
        const response = await axios.get(
            `${url}/pedidos/all/`,
            {
                params: { page },
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("❌ Error al obtener pedidos:", error.response.data);
        } else {
            console.error("Error desconocido:", error);
        }
        throw error;
    }
}

/**
 * Actualiza el estado de un pedido (solo para administradores)
 */
export const updatePedidoEstado = async (pedidoId: number, estado: string): Promise<Pedido> => {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('access_cookie')?.value
        const response = await axios.patch(
            `${url}/pedidos/${pedidoId}/update-estado/`,
            { estado },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("❌ Error al actualizar estado del pedido:", error.response.data);
        } else {
            console.error("Error desconocido:", error);
        }
        throw error;
    }
}

/**
 * Obtiene todos los pedidos del usuario autenticado con paginación
 */
export const obtenerMisPedidos = async (page: number = 1): Promise<PaginatedPedidosResponse> => {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('access_cookie')?.value
        const response = await axios.get(
            `${url}/pedidos/mis-pedidos/`,
            {
                params: { page },
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("❌ Error al obtener pedidos:", error.response.data);
        } else {
            console.error("Error desconocido:", error);
        }
        throw error;
    }
}

/**
 * Obtiene los pedidos pagados del usuario autenticado con paginación
 */
export const obtenerMisPedidosPagados = async (page: number = 1): Promise<PaginatedPedidosResponse> => {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('access_cookie')?.value
        const response = await axios.get(
            `${url}/pedidos/mis-pedidos-pagados/`,
            {
                params: { page },
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("❌ Error al obtener pedidos pagados:", error.response.data);
        } else {
            console.error("Error desconocido:", error);
        }
        throw error;
    }
}