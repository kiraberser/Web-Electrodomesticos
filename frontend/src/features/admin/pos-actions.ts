'use server'

import {
    searchRefaccionesForPOSFiltered,
    createVentaRefaccion,
    type POSSearchFilters,
} from '@/features/admin/ventas-api'
import { getAllMarcas, getAllCategorias } from '@/features/catalog/api'
import type { Refaccion, Marca, Categoria } from '@/features/catalog/api'

export type { Refaccion, Marca, Categoria, POSSearchFilters }

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

/** Carga marcas para los selectores del POS */
export async function getMarcasPOSAction(): Promise<Marca[]> {
    try {
        return await getAllMarcas()
    } catch {
        return []
    }
}

/** Carga categorías para los selectores del POS */
export async function getCategoriasPOSAction(): Promise<Categoria[]> {
    try {
        return await getAllCategorias()
    } catch {
        return []
    }
}

/** Busca refacciones con filtros explícitos — solo se llama al presionar Buscar */
export async function searchRefaccionesAction(filters: POSSearchFilters): Promise<Refaccion[]> {
    const hasFilter = Object.values(filters).some((v) => v && v.trim())
    if (!hasFilter) return []
    return searchRefaccionesForPOSFiltered(filters)
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
