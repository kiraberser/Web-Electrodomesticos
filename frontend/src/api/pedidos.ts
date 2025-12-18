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