"use client"

import axios from 'axios'
import { UpdateUserProfileInput } from '@/types/user'
import { Refaccion } from './productos'

const url = process.env.NEXT_PUBLIC_BASE_URL_API

// Helper function to get token from cookies in client
function getTokenFromCookies(): string | null {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
        const [name, ...rest] = cookie.trim().split('=')
        if (name === 'access_cookie') {
            return decodeURIComponent(rest.join('='))
        }
    }
    return null
}

// Helper function to safely extract error message for logging
function getErrorLogMessage(error: unknown): string {
    if (error && typeof error === 'object') {
        // Check for axios error response
        if ('response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
            return String(error.response.data)
        }
        // Check for error message
        if ('message' in error && typeof error.message === 'string') {
            return error.message
        }
    }
    return 'Error desconocido'
}

/**
 * Actualiza el perfil del usuario (versión cliente)
 * Esta función debe usarse en componentes cliente
 */
export const updateUserProfileClient = async (data: UpdateUserProfileInput) => {
    try {
        const token = getTokenFromCookies()
        
        if (!token) {
            throw new Error('No se encontró el token de autenticación')
        }
        
        // Si hay un archivo avatar, usar FormData, sino JSON normal
        const isFormData = data.avatar instanceof File
        const formData = isFormData ? new FormData() : null
        
        if (isFormData && formData) {
            Object.keys(data).forEach(key => {
                const value = data[key as keyof UpdateUserProfileInput]
                if (value !== undefined && value !== null && value !== '') {
                    if (key === 'avatar' && value instanceof File) {
                        formData.append('avatar', value)
                    } else {
                        formData.append(key, String(value))
                    }
                }
            })
        }
        
        const response = await axios.patch(
            `${url}/user/user-profile/update/`,
            isFormData ? formData : data,
            {
                headers: {
                    'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        return response.data
    } catch (error: unknown) {
        console.error("Error en updateUserProfileClient:", getErrorLogMessage(error))
        throw error
    }
}

// Funciones de Favoritos (versión cliente)
export interface FavoritosResponse {
    favoritos: Refaccion[];
    total: number;
}

export const getFavoritosClient = async (): Promise<FavoritosResponse> => {
    try {
        // Las cookies HttpOnly se envían automáticamente con withCredentials
        // No necesitamos leer el token manualmente
        const response = await axios.get(`${url}/user/user-profile/favoritos/`, {
            withCredentials: true, // Envía cookies automáticamente (incluyendo HttpOnly)
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    } catch (error: unknown) {
        console.error("Error en getFavoritosClient:", getErrorLogMessage(error))
        throw error
    }
}

export const agregarFavoritoClient = async (refaccionId: number): Promise<Refaccion> => {
    try {
        // Las cookies HttpOnly se envían automáticamente con withCredentials
        // No necesitamos leer el token manualmente
        const response = await axios.post(
            `${url}/user/user-profile/favoritos/`,
            { refaccion_id: refaccionId },
            {
                withCredentials: true, // Envía cookies automáticamente (incluyendo HttpOnly)
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        return response.data.favorito
    } catch (error: unknown) {
        console.error("Error en agregarFavoritoClient:", getErrorLogMessage(error))
        throw error
    }
}

export const eliminarFavoritoClient = async (refaccionId: number): Promise<void> => {
    try {
        // Las cookies HttpOnly se envían automáticamente con withCredentials
        // No necesitamos leer el token manualmente
        await axios.delete(
            `${url}/user/user-profile/favoritos/${refaccionId}/`,
            {
                withCredentials: true, // Envía cookies automáticamente (incluyendo HttpOnly)
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (error: unknown) {
        console.error("Error en eliminarFavoritoClient:", getErrorLogMessage(error))
        throw error
    }
}

