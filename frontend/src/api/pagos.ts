'use server'

import axios from 'axios';
import { getToken } from '@/lib/utilscookies';

const url = process.env.NEXT_PUBLIC_BASE_URL_API;

// Helper function to safely extract error message for logging
function getErrorLogMessage(error: unknown): string {
    if (error && typeof error === 'object') {
        // Check for axios error response
        if ('response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
            return String(error.response.data);
        }
        // Check for error message
        if ('message' in error && typeof error.message === 'string') {
            return error.message;
        }
    }
    return 'Error desconocido';
}

export interface CheckoutItem {
    refaccion: number;
    cantidad: number;
}

export interface CheckoutResponse {
    pedido_id: number;
    total: string;
    estado: string;
}

export interface PreferenciaPagoRequest {
    pedido_id: number;
    items: {
        title: string;
        quantity: number;
        unit_price: number;
    }[];
    back_urls?: {
        success?: string;
        failure?: string;
        pending?: string;
    };
}

export interface PreferenciaPagoResponse {
    preference_id: string;
    init_point: string;
    sandbox_init_point?: string;
    pago_id: number;
}

export interface PagoInfo {
    id: number;
    preference_id: string;
    payment_id: string | null;
    status: string;
    status_detail: string | null;
    amount: string;
    currency: string;
    payment_method_id: string | null;
    payment_type_id: string | null;
    fecha_creacion: string;
    fecha_aprobacion: string | null;
}

/**
 * Crea un pedido en estado CREADO
 */
export const crearPedido = async (items: CheckoutItem[]): Promise<CheckoutResponse> => {
    try {
        const response = await axios.post(
            `${url}/pedidos/checkout/`,
            { items },
            { headers: { Authorization: `Bearer ${await getToken()}` } }
        );
        return response.data;
    } catch (error: unknown) {
        console.error("Error en crearPedido:", getErrorLogMessage(error));
        throw error;
    }
};

/**
 * Crea una preferencia de pago en Mercado Pago
 */
export const crearPreferenciaPago = async (
    data: PreferenciaPagoRequest
): Promise<PreferenciaPagoResponse> => {
    try {
        const response = await axios.post(
            `${url}/pagos/crear-preferencia/`,
            data,
            { headers: { Authorization: `Bearer ${await getToken()}` } }
        );
        return response.data;
    } catch (error: unknown) {
        console.error("Error en crearPreferenciaPago:", getErrorLogMessage(error));
        throw error;
    }
};

/**
 * Consulta el estado de un pago
 */
export const consultarPago = async (pagoId: number): Promise<PagoInfo> => {
    try {
        const response = await axios.get(
            `${url}/pagos/${pagoId}/`,
            { headers: { Authorization: `Bearer ${await getToken()}` } }
        );
        return response.data;
    } catch (error: unknown) {
        console.error("Error en consultarPago:", getErrorLogMessage(error));
        throw error;
    }
};

