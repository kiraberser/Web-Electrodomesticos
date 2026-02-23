'use server'

import axios from 'axios'
import { cookies } from 'next/headers'
import type { Refaccion } from '@/features/catalog/api'

const url = process.env.NEXT_PUBLIC_BASE_URL_API

export interface CartItemResponse {
    id: number
    refaccion: Refaccion
    cantidad: number
    created_at?: string
    updated_at?: string
}

export interface CartResponse {
    cart: CartItemResponse[]
    total: number
}

const getAuthHeader = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getCartAction = async (): Promise<CartResponse> => {
    const headers = await getAuthHeader()
    const response = await axios.get(`${url}/user/user-profile/cart/`, {
        headers: { 'Content-Type': 'application/json', ...headers }
    })
    return response.data
}

export const addCartItemAction = async (
    refaccionId: number,
    cantidad: number = 1
): Promise<CartItemResponse | null> => {
    try {
        const headers = await getAuthHeader()
        const response = await axios.post(
            `${url}/user/user-profile/cart/`,
            { refaccion_id: refaccionId, cantidad },
            { headers: { 'Content-Type': 'application/json', ...headers } }
        )
        return response.data.item
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            const data = error.response.data
            const errors = data?.non_field_errors
            if (Array.isArray(errors) && errors.some((msg: string) => msg.includes('ya está en tu carrito'))) {
                return null
            }
        }
        throw error
    }
}

export const removeCartItemAction = async (refaccionId: number): Promise<void> => {
    const headers = await getAuthHeader()
    await axios.delete(`${url}/user/user-profile/cart/${refaccionId}/`, {
        headers: { 'Content-Type': 'application/json', ...headers }
    })
}

export const clearCartAction = async (): Promise<void> => {
    const headers = await getAuthHeader()
    await axios.delete(`${url}/user/user-profile/cart/`, {
        headers: { 'Content-Type': 'application/json', ...headers }
    })
}

export const setCartItemQuantityAction = async (refaccionId: number, cantidad: number): Promise<void> => {
    if (cantidad <= 0) {
        await removeCartItemAction(refaccionId)
        return
    }
    await removeCartItemAction(refaccionId)
    await addCartItemAction(refaccionId, cantidad)
}
