'use server'

import axios from 'axios'
import { cookies } from 'next/headers'
import type { CheckoutItem } from '@/features/payments/api'

const url = process.env.NEXT_PUBLIC_BASE_URL_API

async function getAuthHeader(): Promise<Record<string, string>> {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export interface ShippingDataRegistrado {
    direccion_id?: number
    calle?: string
    ciudad?: string
    estado_envio?: string
    codigo_postal?: string
    notas?: string
}

export interface CrearPedidoResult {
    success: boolean
    pedidoId?: number
    total?: string
    error?: string
}

export async function crearPedidoRegistradoAction(
    items: CheckoutItem[],
): Promise<CrearPedidoResult> {
    try {
        const headers = await getAuthHeader()
        const response = await axios.post(
            `${url}/pedidos/checkout/`,
            { items },
            { headers: { 'Content-Type': 'application/json', ...headers } },
        )
        return { success: true, pedidoId: response.data.pedido_id, total: response.data.total }
    } catch (error: unknown) {
        const msg =
            axios.isAxiosError(error) && error.response?.data?.detail
                ? error.response.data.detail
                : 'Error al crear el pedido'
        return { success: false, error: msg }
    }
}

export interface GuestOrderData {
    guest_name: string
    guest_email: string
    guest_phone: string
    calle: string
    ciudad: string
    estado_envio: string
    codigo_postal: string
    notas?: string
    items: CheckoutItem[]
}

export async function crearPedidoInvitadoAction(data: GuestOrderData): Promise<CrearPedidoResult> {
    try {
        const response = await axios.post(`${url}/pedidos/checkout-invitado/`, data, {
            headers: { 'Content-Type': 'application/json' },
        })
        return { success: true, pedidoId: response.data.pedido_id, total: response.data.total }
    } catch (error: unknown) {
        const msg =
            axios.isAxiosError(error) && error.response?.data?.detail
                ? error.response.data.detail
                : 'Error al crear el pedido'
        return { success: false, error: msg }
    }
}

export interface PagoCardData {
    pedido_id: number
    token: string
    payment_method_id: string
    issuer_id?: string
    installments: number
    payer_email: string
}

export interface PagoResult {
    success: boolean
    status?: 'approved' | 'rejected' | 'pending'
    payment_id?: string | number
    detail?: string
    error?: string
}

export async function procesarPagoCardAction(data: PagoCardData): Promise<PagoResult> {
    try {
        const response = await axios.post(`${url}/pagos/procesar-card/`, data, {
            headers: { 'Content-Type': 'application/json' },
        })
        return {
            success: true,
            status: response.data.status,
            payment_id: response.data.payment_id,
            detail: response.data.detail,
        }
    } catch (error: unknown) {
        const msg =
            axios.isAxiosError(error) && error.response?.data?.error
                ? error.response.data.error
                : 'Error al procesar el pago'
        return { success: false, error: msg }
    }
}

export interface PagoEfectivoData {
    pedido_id: number
    payment_method_id: 'oxxo' | 'paycash'
    payer_email: string
}

export interface PagoEfectivoResult {
    success: boolean
    status?: string
    payment_id?: string | number
    voucher_url?: string
    expires_at?: string
    error?: string
}

export async function procesarPagoEfectivoAction(
    data: PagoEfectivoData,
): Promise<PagoEfectivoResult> {
    try {
        const response = await axios.post(`${url}/pagos/procesar-efectivo/`, data, {
            headers: { 'Content-Type': 'application/json' },
        })
        return {
            success: true,
            status: response.data.status,
            payment_id: response.data.payment_id,
            voucher_url: response.data.voucher_url,
            expires_at: response.data.expires_at,
        }
    } catch (error: unknown) {
        const msg =
            axios.isAxiosError(error) && error.response?.data?.error
                ? error.response.data.error
                : 'Error al generar la referencia de pago'
        return { success: false, error: msg }
    }
}

// ─── Atomic checkout endpoints (create order + payment in one call) ───────────

export interface CheckoutCardData {
    items: CheckoutItem[]
    calle: string
    ciudad: string
    estado_envio: string
    codigo_postal: string
    notas?: string
    guest_name?: string
    guest_email?: string
    guest_phone?: string
    token: string
    payment_method_id: string
    issuer_id?: string
    installments: number
    payer_email: string
}

export interface CheckoutCardResult {
    success: boolean
    status?: 'approved' | 'rejected' | 'pending'
    payment_id?: string | number
    detail?: string
    pedidoId?: number
    total?: string
    error?: string
}

export async function procesarCheckoutCardAction(
    data: CheckoutCardData,
): Promise<CheckoutCardResult> {
    try {
        const headers = await getAuthHeader()
        const response = await axios.post(`${url}/pagos/checkout-card/`, data, {
            headers: { 'Content-Type': 'application/json', ...headers },
        })
        return {
            success: true,
            status: response.data.status,
            payment_id: response.data.payment_id,
            detail: response.data.detail,
            pedidoId: response.data.pedido_id,
            total: response.data.total,
        }
    } catch (error: unknown) {
        const msg =
            axios.isAxiosError(error) && error.response?.data?.error
                ? error.response.data.error
                : 'Error al procesar el pago'
        return { success: false, error: msg }
    }
}

export interface CheckoutEfectivoData {
    items: CheckoutItem[]
    calle: string
    ciudad: string
    estado_envio: string
    codigo_postal: string
    notas?: string
    guest_name?: string
    guest_email?: string
    guest_phone?: string
    payment_method_id: 'oxxo' | 'paycash'
    payer_email: string
}

export interface CheckoutEfectivoResult {
    success: boolean
    status?: string
    payment_id?: string | number
    voucher_url?: string
    expires_at?: string
    pedidoId?: number
    total?: string
    error?: string
}

export async function procesarCheckoutEfectivoAction(
    data: CheckoutEfectivoData,
): Promise<CheckoutEfectivoResult> {
    try {
        const headers = await getAuthHeader()
        const response = await axios.post(`${url}/pagos/checkout-efectivo/`, data, {
            headers: { 'Content-Type': 'application/json', ...headers },
        })
        return {
            success: true,
            status: response.data.status,
            payment_id: response.data.payment_id,
            voucher_url: response.data.voucher_url,
            expires_at: response.data.expires_at,
            pedidoId: response.data.pedido_id,
            total: response.data.total,
        }
    } catch (error: unknown) {
        const msg =
            axios.isAxiosError(error) && error.response?.data?.error
                ? error.response.data.error
                : 'Error al generar la referencia de pago'
        return { success: false, error: msg }
    }
}

export interface CuponResult {
    success: boolean
    discount?: number
    message?: string
}

export async function validarCuponAction(_codigo: string): Promise<CuponResult> {
    // Placeholder — backend endpoint /api/v1/cupones/validar/ no implementado aún
    return { success: false, message: 'Cupones no disponibles por el momento' }
}
