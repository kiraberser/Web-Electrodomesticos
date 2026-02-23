'use server'

import { getFavoritos, agregarFavorito, eliminarFavorito } from '@/features/auth/api'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

// Helper para verificar autenticación
async function checkAuth(): Promise<boolean> {
    const cookieStore = await cookies()
    const username = cookieStore.get('username')?.value
    return !!username
}

export async function getFavoritosAction() {
    try {
        const isAuthenticated = await checkAuth()
        if (!isAuthenticated) {
            redirect('/cuenta/login')
        }
        
        const data = await getFavoritos()
        return {
            success: true,
            data: data.favoritos,
            total: data.total
        }
    } catch (error) {
        console.error('Error obteniendo favoritos:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al obtener favoritos',
            data: [],
            total: 0
        }
    }
}

export async function checkFavoritoAction(refaccionId: number) {
    try {
        const isAuthenticated = await checkAuth()
        if (!isAuthenticated) {
            return {
                success: false,
                isFavorite: false
            }
        }
        
        const data = await getFavoritos()
        const favoritoIds = data.favoritos.map((f: any) => f.id)
        const isFavorite = favoritoIds.includes(refaccionId)
        
        return {
            success: true,
            isFavorite
        }
    } catch (error) {
        // Silenciar errores y retornar false
        return {
            success: false,
            isFavorite: false
        }
    }
}

export async function agregarFavoritoAction(refaccionId: number) {
    try {
        const isAuthenticated = await checkAuth()
        if (!isAuthenticated) {
            return {
                success: false,
                error: 'Debes iniciar sesión para agregar productos a favoritos'
            }
        }
        
        await agregarFavorito(refaccionId)
        // No revalidar automáticamente para evitar peticiones innecesarias
        // El estado optimista en el cliente maneja la UI inmediatamente
        // La página de favoritos se actualizará cuando el usuario navegue allí
        
        return {
            success: true,
            message: 'Producto agregado a favoritos'
        }
    } catch (error: unknown) {
        console.error('Error agregando favorito:', error)
        const errorMessage = error && typeof error === 'object' && 'response' in error
            ? (error.response as any)?.data?.detail || 'Error al agregar a favoritos'
            : 'Error al agregar a favoritos'
        
        return {
            success: false,
            error: errorMessage
        }
    }
}

export async function eliminarFavoritoAction(refaccionId: number) {
    try {
        const isAuthenticated = await checkAuth()
        if (!isAuthenticated) {
            return {
                success: false,
                error: 'Debes iniciar sesión para eliminar productos de favoritos'
            }
        }
        
        await eliminarFavorito(refaccionId)
        // Revalidar la página de favoritos para actualizar la lista
        revalidatePath('/cuenta/perfil/favoritos')
        
        return {
            success: true,
            message: 'Producto eliminado de favoritos'
        }
    } catch (error: unknown) {
        console.error('Error eliminando favorito:', error)
        const errorMessage = error && typeof error === 'object' && 'response' in error
            ? (error.response as any)?.data?.detail || 'Error al eliminar de favoritos'
            : 'Error al eliminar de favoritos'
        
        return {
            success: false,
            error: errorMessage
        }
    }
}

