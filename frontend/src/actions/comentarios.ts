'use server'

import { getComentariosProducto, createComentarioProducto, deleteComentarioProducto, type ComentarioProducto } from '@/api/productos'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { getUser } from '@/api/user'

export type ComentarioActionState = {
    success: boolean
    error?: string
    data?: ComentarioProducto
}

/**
 * Verifica si el usuario está autenticado en el servidor
 */
async function checkServerAuthentication(): Promise<boolean> {
    const cookieStore = await cookies()
    const accessCookie = cookieStore.get('access_cookie')
    return !!accessCookie?.value
}

/**
 * Obtiene el ID del usuario actual desde el servidor
 */
async function getCurrentUserId(): Promise<number | null> {
    try {
        const user = await getUser()
        return user?.id || null
    } catch (error) {
        console.error('Error obteniendo usuario actual:', error)
        return null
    }
}

/**
 * Obtiene comentarios de un producto
 */
export async function getComentariosAction(
    refaccionId: number,
    limit?: number
): Promise<{ success: boolean; data?: ComentarioProducto[]; error?: string }> {
    try {
        const comentarios = await getComentariosProducto(refaccionId, limit)
        return {
            success: true,
            data: comentarios
        }
    } catch (error) {
        console.error('Error obteniendo comentarios:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al obtener comentarios',
            data: []
        }
    }
}

/**
 * Crea un comentario para un producto
 * Compatible con useFormState - acepta FormData o parámetros directos
 */
export async function createComentarioAction(
    prevState: ComentarioActionState | null,
    formData: FormData
): Promise<ComentarioActionState> {
    try {
        const isAuthenticated = await checkServerAuthentication()
        
        if (!isAuthenticated) {
            return {
                success: false,
                error: 'Debes iniciar sesión para publicar un comentario'
            }
        }

        // Extraer datos del FormData
        const refaccionId = parseInt(formData.get('refaccionId') as string)
        const calificacion = parseInt(formData.get('calificacion') as string)
        const comentario = formData.get('comentario') as string

        // Validaciones
        if (!refaccionId || isNaN(refaccionId)) {
            return {
                success: false,
                error: 'Producto no válido'
            }
        }

        if (!comentario || !comentario.trim()) {
            return {
                success: false,
                error: 'El comentario no puede estar vacío'
            }
        }

        if (!calificacion || calificacion < 1 || calificacion > 5) {
            return {
                success: false,
                error: 'La calificación debe estar entre 1 y 5 estrellas'
            }
        }

        const comentarioData = await createComentarioProducto({ refaccion: refaccionId, calificacion, comentario: comentario.trim() })

        // Revalidar la página del producto para mostrar el nuevo comentario
        revalidatePath(`/productos/*`)

        return {
            success: true,
            data: comentarioData
        }
    } catch (error: unknown) {
        let errorMessage = 'Error al publicar el comentario'

        if (error && typeof error === 'object' && 'response' in error) {
            const response = error.response as any
            if (response?.data) {
                // Manejar errores de validación del backend
                if (response.data.refaccion) {
                    errorMessage = 'Producto no encontrado'
                } else if (response.data.non_field_errors) {
                    errorMessage = Array.isArray(response.data.non_field_errors)
                        ? response.data.non_field_errors[0]
                        : response.data.non_field_errors
                } else if (response.data.detail) {
                    errorMessage = response.data.detail
                } else if (typeof response.data === 'string') {
                    errorMessage = response.data
                }
            }
        } else if (error instanceof Error) {
            errorMessage = error.message
        }

        return {
            success: false,
            error: errorMessage
        }
    }
}

/**
 * Elimina un comentario de un producto
 * Solo el propietario del comentario puede eliminarlo
 */
export async function deleteComentarioAction(
    comentarioId: number,
    usuarioId: number
): Promise<{ success: boolean; error?: string }> {
    try {
        const isAuthenticated = await checkServerAuthentication()
        
        if (!isAuthenticated) {
            return {
                success: false,
                error: 'Debes iniciar sesión para eliminar un comentario'
            }
        }

        // Verificar que el usuario actual sea el propietario del comentario
        const currentUserId = await getCurrentUserId()
        
        if (!currentUserId || currentUserId !== usuarioId) {
            return {
                success: false,
                error: 'No tienes permiso para eliminar este comentario'
            }
        }

        await deleteComentarioProducto(comentarioId)

        // Revalidar la página del producto para actualizar los comentarios
        revalidatePath(`/productos/*`)

        return {
            success: true
        }
    } catch (error: unknown) {
        let errorMessage = 'Error al eliminar el comentario'

        if (error && typeof error === 'object' && 'response' in error) {
            const response = error.response as any
            if (response?.data) {
                if (response.data.detail) {
                    errorMessage = response.data.detail
                } else if (typeof response.data === 'string') {
                    errorMessage = response.data
                }
            }
        } else if (error instanceof Error) {
            errorMessage = error.message
        }

        return {
            success: false,
            error: errorMessage
        }
    }
}
