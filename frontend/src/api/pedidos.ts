import axios from 'axios';
import { getToken } from '@/lib/utilscookies';

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
        const response = await axios.post(
            `${url}/pedidos/checkout/`, 
            { items }, 
            { headers: { Authorization: `Bearer ${await getToken()}` } }
        );
        return response.data;
    } catch (error: any) {

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
        const response = await axios.get(
            `${url}/pedidos/all/`,
            { 
                params: { page },
                headers: { Authorization: `Bearer ${await getToken()}` } 
            }
        );
        return response.data;
    } catch (error: any) {
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
        const response = await axios.patch(
            `${url}/pedidos/${pedidoId}/update-estado/`,
            { estado },
            { headers: { Authorization: `Bearer ${await getToken()}` } }
        );
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("❌ Error al actualizar estado del pedido:", error.response.data);
        } else {
            console.error("Error desconocido:", error);
        }
        throw error;
    }
}