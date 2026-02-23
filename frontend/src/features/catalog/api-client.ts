"use client"

import { type ComentarioProducto } from "./productos"

const url = process.env.NEXT_PUBLIC_BASE_URL_API

/**
 * Obtiene comentarios de un producto (endpoint publico, no requiere auth)
 * Para uso en componentes cliente
 */
export const getComentariosProductoClient = async (refaccionId: number): Promise<ComentarioProducto[]> => {
    try {
        const params = new URLSearchParams()
        params.append('refaccion_id', String(refaccionId))

        const response = await fetch(`${url}/productos/comentarios/?${params.toString()}`, {
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
        })

        if (!response.ok) {
            throw new Error('Failed to fetch comentarios')
        }

        const data = await response.json()
        const comentarios = data.results || data
        return Array.isArray(comentarios) ? comentarios : []
    } catch (error) {
        console.error('Error fetching comentarios:', error)
        return []
    }
}
