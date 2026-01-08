'use server'

import { cookies } from "next/headers"
import { loginUser, createUser, updateUserProfile, getDirecciones, createDireccion, updateDireccion, deleteDireccion } from "@/api/user"
import { redirect } from "next/navigation"

import { LoginUserType, CreateUserType, UpdateUserProfileInput, CreateDireccionInput, UpdateDireccionInput, Direccion } from "@/types/user"

export type ActionState = {
    success: boolean
    error: string | null | Record<string, { _errors: string[] }> | unknown
    data?: unknown
}

export const actionLoginUser = async (formData: LoginUserType) => {
    const response = await loginUser(formData)
    console.log(response)
    const cookieStore = await cookies()
    
    cookieStore.set({
        name: 'username',
        value: response['usuario'],
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        secure: true,
        sameSite: 'lax'
    })
    cookieStore.set({
        name: 'access_cookie',
        value: response['access'],
        httpOnly: true,
        path: '/',
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 15
    })
    cookieStore.set({
        name: 'refresh_cookie',
        value: response['refresh'],
        httpOnly: true,
        path: '/',
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
    })

    return { success: true }
}

export const actionCreateUser = async (formData: CreateUserType) => {
    await createUser(formData)
    return { success: true }
}

export const actionLogOutUser = async () => {
    const cookieStore = await cookies()
    cookieStore.delete('access_cookie')
    cookieStore.delete('refresh_cookie')
    cookieStore.delete('username')
    redirect('/')
}

// Helper function to safely extract error message
function getErrorMessage(error: unknown, defaultMessage: string): string {
    if (error && typeof error === 'object') {
        // Check for axios error response
        if ('response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
            const data = error.response.data
            // Handle validation errors
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                // Check for field-specific errors
                const fieldErrors = Object.keys(data).map(key => {
                    const value = (data as Record<string, unknown>)[key]
                    if (Array.isArray(value)) {
                        return `${key}: ${value[0]}`
                    }
                    return `${key}: ${String(value)}`
                })
                if (fieldErrors.length > 0) {
                    return fieldErrors.join(', ')
                }
            }
            return String(data)
        }
        // Check for error message
        if ('message' in error && typeof error.message === 'string') {
            return error.message
        }
    }
    return defaultMessage
}

export const updateUserProfileAction = async (
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> => {
    try {
        // Extract form data
        const first_name = (formData.get("first_name") as string)?.trim() || ""
        const last_name = (formData.get("last_name") as string)?.trim() || ""
        const email = (formData.get("email") as string)?.trim() || ""
        const phone = (formData.get("phone") as string)?.trim() || ""
        const bio = (formData.get("bio") as string)?.trim() || ""
        const address_street = (formData.get("address_street") as string)?.trim() || ""
        const address_colony = (formData.get("address_colony") as string)?.trim() || ""
        const address_city = (formData.get("address_city") as string)?.trim() || ""
        const address_state = (formData.get("address_state") as string)?.trim() || ""
        const address_postal_code = (formData.get("address_postal_code") as string)?.trim() || ""
        const address_references = (formData.get("address_references") as string)?.trim() || ""
        const avatarFile = formData.get("avatar") as File | null

        // Validaciones básicas
        const fieldErrors: Record<string, { _errors: string[] }> = {}

        if (!email) {
            fieldErrors.email = { _errors: ["El correo electrónico es requerido"] }
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                fieldErrors.email = { _errors: ["Por favor ingresa un email válido"] }
            }
        }

        // Phone validation (optional, but if provided should be valid)
        if (phone && phone.length > 0) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/
            if (!phoneRegex.test(phone)) {
                fieldErrors.phone = { _errors: ["Por favor ingresa un teléfono válido"] }
            }
        }

        // Postal code validation (optional, but if provided should be valid)
        if (address_postal_code && address_postal_code.length > 0) {
            const cleaned = address_postal_code.replace(/\s|-/g, '')
            if (!/^\d{5}$/.test(cleaned)) {
                fieldErrors.address_postal_code = { _errors: ["El código postal debe tener 5 dígitos"] }
            }
        }

        if (Object.keys(fieldErrors).length > 0) {
            return {
                success: false,
                error: fieldErrors
            }
        }

        // Prepare data for API
        const updateData: UpdateUserProfileInput = {}
        
        if (first_name) {
            updateData.first_name = first_name
        }
        if (last_name) {
            updateData.last_name = last_name
        }
        if (email) {
            updateData.email = email
        }
        if (phone) {
            updateData.phone = phone
        }
        if (bio) {
            updateData.bio = bio
        }
        if (address_street) {
            updateData.address_street = address_street
        }
        if (address_colony) {
            updateData.address_colony = address_colony
        }
        if (address_city) {
            updateData.address_city = address_city
        }
        if (address_state) {
            updateData.address_state = address_state
        }
        if (address_postal_code) {
            updateData.address_postal_code = address_postal_code.replace(/\s|-/g, '')
        }
        if (address_references) {
            updateData.address_references = address_references
        }
        if (avatarFile && avatarFile.size > 0) {
            updateData.avatar = avatarFile
        }

        const response = await updateUserProfile(updateData)
        
        return {
            success: true,
            error: null,
            data: response.usuario
        }
    } catch (error: unknown) {
        console.error("Error updating user profile:", error)
        return {
            success: false,
            error: getErrorMessage(error, "Error al actualizar el perfil")
        }
    }
}

export const getDireccionesAction = async (): Promise<ActionState & { data?: Direccion[] }> => {
    try {
        const direcciones = await getDirecciones()
        return {
            success: true,
            error: null,
            data: direcciones
        }
    } catch (error: unknown) {
        console.error("Error getting direcciones:", error)
        return {
            success: false,
            error: getErrorMessage(error, "Error al obtener las direcciones")
        }
    }
}

export const createDireccionAction = async (
    prevState: ActionState,
    formData: FormData
): Promise<ActionState & { data?: Direccion }> => {
    try {
        const nombre = (formData.get("nombre") as string)?.trim() || ""
        const street = (formData.get("street") as string)?.trim() || ""
        const colony = (formData.get("colony") as string)?.trim() || ""
        const city = (formData.get("city") as string)?.trim() || ""
        const state = (formData.get("state") as string)?.trim() || ""
        const postal_code = (formData.get("postal_code") as string)?.trim() || ""
        const references = (formData.get("references") as string)?.trim() || ""
        const is_primary = formData.get("is_primary") === "true"

        // Validaciones
        const fieldErrors: Record<string, { _errors: string[] }> = {}

        if (!nombre) {
            fieldErrors.nombre = { _errors: ["El nombre de la dirección es requerido"] }
        }

        if (!street) {
            fieldErrors.street = { _errors: ["La calle y número son requeridos"] }
        }

        if (!colony) {
            fieldErrors.colony = { _errors: ["La colonia es requerida"] }
        }

        if (!city) {
            fieldErrors.city = { _errors: ["La ciudad es requerida"] }
        }

        if (!state) {
            fieldErrors.state = { _errors: ["El estado es requerido"] }
        }

        if (!postal_code) {
            fieldErrors.postal_code = { _errors: ["El código postal es requerido"] }
        } else {
            const cleaned = postal_code.replace(/\s|-/g, '')
            if (!/^\d{5}$/.test(cleaned)) {
                fieldErrors.postal_code = { _errors: ["El código postal debe tener 5 dígitos"] }
            }
        }

        if (Object.keys(fieldErrors).length > 0) {
            return {
                success: false,
                error: fieldErrors
            }
        }

        const direccionData: CreateDireccionInput = {
            nombre,
            street,
            colony,
            city,
            state,
            postal_code: postal_code.replace(/\s|-/g, ''),
            references: references || undefined,
            is_primary
        }

        const direccion = await createDireccion(direccionData)

        return {
            success: true,
            error: null,
            data: direccion
        }
    } catch (error: unknown) {
        console.error("Error creating direccion:", error)
        return {
            success: false,
            error: getErrorMessage(error, "Error al crear la dirección")
        }
    }
}

export const updateDireccionAction = async (
    id: number,
    prevState: ActionState,
    formData: FormData
): Promise<ActionState & { data?: Direccion }> => {
    try {
        const nombre = (formData.get("nombre") as string)?.trim() || ""
        const street = (formData.get("street") as string)?.trim() || ""
        const colony = (formData.get("colony") as string)?.trim() || ""
        const city = (formData.get("city") as string)?.trim() || ""
        const state = (formData.get("state") as string)?.trim() || ""
        const postal_code = (formData.get("postal_code") as string)?.trim() || ""
        const references = (formData.get("references") as string)?.trim() || ""
        const is_primary = formData.get("is_primary") === "true"

        // Validaciones
        const fieldErrors: Record<string, { _errors: string[] }> = {}

        if (!nombre) {
            fieldErrors.nombre = { _errors: ["El nombre de la dirección es requerido"] }
        }

        if (!street) {
            fieldErrors.street = { _errors: ["La calle y número son requeridos"] }
        }

        if (!colony) {
            fieldErrors.colony = { _errors: ["La colonia es requerida"] }
        }

        if (!city) {
            fieldErrors.city = { _errors: ["La ciudad es requerida"] }
        }

        if (!state) {
            fieldErrors.state = { _errors: ["El estado es requerido"] }
        }

        if (!postal_code) {
            fieldErrors.postal_code = { _errors: ["El código postal es requerido"] }
        } else {
            const cleaned = postal_code.replace(/\s|-/g, '')
            if (!/^\d{5}$/.test(cleaned)) {
                fieldErrors.postal_code = { _errors: ["El código postal debe tener 5 dígitos"] }
            }
        }

        if (Object.keys(fieldErrors).length > 0) {
            return {
                success: false,
                error: fieldErrors
            }
        }

        const direccionData: UpdateDireccionInput = {
            nombre,
            street,
            colony,
            city,
            state,
            postal_code: postal_code.replace(/\s|-/g, ''),
            references: references || undefined,
            is_primary
        }

        const direccion = await updateDireccion(id, direccionData)

        return {
            success: true,
            error: null,
            data: direccion
        }
    } catch (error: unknown) {
        console.error("Error updating direccion:", error)
        return {
            success: false,
            error: getErrorMessage(error, "Error al actualizar la dirección")
        }
    }
}

export const deleteDireccionAction = async (id: number): Promise<ActionState> => {
    try {
        await deleteDireccion(id)
        return {
            success: true,
            error: null
        }
    } catch (error: unknown) {
        console.error("Error deleting direccion:", error)
        return {
            success: false,
            error: getErrorMessage(error, "Error al eliminar la dirección")
        }
    }
}