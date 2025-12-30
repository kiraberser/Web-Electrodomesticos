"use client"

import axios from 'axios'
import { UpdateUserProfileInput } from '@/types/user'

const url = process.env.NEXT_PUBLIC_BASE_URL_API

// Helper function to get token from cookies in client
function getTokenFromCookies(): string | null {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=')
        if (name === 'access_cookie') {
            return decodeURIComponent(value)
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

