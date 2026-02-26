'use server'

import { searchRefaccionesForPOS, createVentaRefaccion } from '@/features/admin/ventas-api'
import type { Refaccion } from '@/features/catalog/api'

export type { Refaccion }

export interface CartItem {
    refaccion: Refaccion
    cantidad: number
    precio_unitario: number
}

export interface CreateVentasResult {
    success: boolean
    error?: string
    ids?: number[]
    total?: number
}

/** Busca refacciones por nombre — llamado desde el cliente */
export async function searchRefaccionesAction(query: string): Promise<Refaccion[]> {
    if (!query.trim() || query.trim().length < 2) return []
    return searchRefaccionesForPOS(query.trim())
}

/** Crea una venta por cada ítem del carrito */
export async function createVentasAction(items: CartItem[]): Promise<CreateVentasResult> {
    try {
        const results = await Promise.all(
            items.map((item) =>
                createVentaRefaccion({
                    refaccion: item.refaccion.id!,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio_unitario,
                }),
            ),
        )
        const total = items.reduce(
            (sum, item) => sum + item.cantidad * item.precio_unitario,
            0,
        )
        return { success: true, ids: results.map((r) => r.id), total }
    } catch (error: unknown) {
        console.error('Error creando ventas POS:', error)
        return { success: false, error: 'Error al registrar la venta. Intente de nuevo.' }
    }
}
