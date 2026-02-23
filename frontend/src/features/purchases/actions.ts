'use server'

import { obtenerMisPedidosPagados } from '@/features/orders/api'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { PaginatedPedidosResponse } from '@/features/orders/api'

// Helper para verificar autenticación
async function checkAuth(): Promise<boolean> {
    const cookieStore = await cookies()
    const username = cookieStore.get('username')?.value
    return !!username
}

export async function obtenerMisComprasAction(page: number = 1): Promise<{
    success: boolean
    data: PaginatedPedidosResponse | null
    error?: string
}> {
    try {
        const isAuthenticated = await checkAuth()
        if (!isAuthenticated) {
            redirect('/cuenta/login')
        }
        
        const data = await obtenerMisPedidosPagados(page)
        return {
            success: true,
            data: data || null
        }
    } catch (error) {
        console.error('Error obteniendo mis compras:', error)
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Error al obtener tus compras'
        }
    }
}

