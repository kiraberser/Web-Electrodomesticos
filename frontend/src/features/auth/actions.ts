'use server'

import { cookies } from "next/headers"
import { loginUser, createUser, updateUserProfile, getDirecciones, createDireccion, updateDireccion, deleteDireccion } from "@/features/auth/api"
import { redirect } from "next/navigation"
import { createDireccionSchema, direccionExtraInfoSchema, updateDireccionSchema } from "@/shared/lib/validations/direccion"
import { LoginUserType, CreateUserType, UpdateUserProfileInput, Direccion } from "@/shared/types/user"
import { ActionState, formatZodErrors, getErrorMessage } from "@/shared/lib/action-types"

export type { ActionState }

export const actionLoginUser = async (formData: LoginUserType): Promise<ActionState> => {
    try {
        const [response, cookieStore] = await Promise.all([
            loginUser(formData),
            cookies()
        ])

        const isDevelopment = process.env.NODE_ENV === 'development'

        cookieStore.set({
            name: 'username',
            value: response['usuario'],
            path: '/',
            maxAge: 60 * 60 * 24,
            secure: !isDevelopment,
            sameSite: 'lax',
        })
        cookieStore.set({
            name: 'access_cookie',
            value: response['access'],
            httpOnly: true,
            path: '/',
            secure: !isDevelopment,
            sameSite: 'lax',
            maxAge: 60 * 15,
        })
        cookieStore.set({
            name: 'refresh_cookie',
            value: response['refresh'],
            httpOnly: true,
            path: '/',
            secure: !isDevelopment,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24,
        })

        return { success: true, error: null }
    } catch (error: unknown) {
        // Detect network errors (backend not reachable)
        if (
            error &&
            typeof error === 'object' &&
            'code' in error &&
            (error as { code: string }).code === 'ECONNREFUSED'
        ) {
            return { success: false, error: 'Servicio no disponible. Intente más tarde.' }
        }
        return { success: false, error: 'Correo o contraseña incorrectos' }
    }
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
        // Extract form data
        const rawData = {
            nombre: (formData.get("nombre") as string)?.trim() || "",
            street: (formData.get("street") as string)?.trim() || "",
            colony: (formData.get("colony") as string)?.trim() || "",
            city: (formData.get("city") as string)?.trim() || "",
            state: (formData.get("state") as string)?.trim() || "",
            postal_code: (formData.get("postal_code") as string)?.trim() || "",
            references: (formData.get("references") as string)?.trim() || undefined,
            is_primary: formData.get("is_primary") === "true",
        }

        // Validate with Zod
        const validationResult = createDireccionSchema.safeParse(rawData)

        if (!validationResult.success) {
            return {
                success: false,
                error: formatZodErrors(validationResult.error)
            }
        }

        const direccionData = validationResult.data
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
        // Extract form data
        const rawData: Record<string, unknown> = {}
        
        const nombre = (formData.get("nombre") as string)?.trim()
        const street = (formData.get("street") as string)?.trim()
        const colony = (formData.get("colony") as string)?.trim()
        const city = (formData.get("city") as string)?.trim()
        const state = (formData.get("state") as string)?.trim()
        const postal_code = (formData.get("postal_code") as string)?.trim()
        const references = (formData.get("references") as string)?.trim()
        const is_primary = formData.get("is_primary")

        if (nombre) rawData.nombre = nombre
        if (street) rawData.street = street
        if (colony) rawData.colony = colony
        if (city) rawData.city = city
        if (state) rawData.state = state
        if (postal_code) rawData.postal_code = postal_code
        if (references) rawData.references = references
        if (is_primary !== null) rawData.is_primary = is_primary === "true"

        // Validate with Zod (partial update)
        const validationResult = updateDireccionSchema.safeParse(rawData)

        if (!validationResult.success) {
            return {
                success: false,
                error: formatZodErrors(validationResult.error)
            }
        }

        const direccionData = validationResult.data
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

export const updateDireccionExtraInfoAction = async (
    id: number,
    prevState: ActionState,
    formData: FormData
): Promise<ActionState & { data?: Direccion }> => {
    try {
        // Extract form data for extra info
        const rawData: Record<string, unknown> = {}

        const tipo_lugar = formData.get("tipo_lugar") as string
        const barrio_privado = formData.get("barrio_privado")
        const conserjeria = formData.get("conserjeria")
        const nombre_lugar = (formData.get("nombre_lugar") as string)?.trim()
        const horario_apertura = (formData.get("horario_apertura") as string)?.trim()
        const horario_cierre = (formData.get("horario_cierre") as string)?.trim()
        const horario_24hs = formData.get("horario_24hs")
        const horarios_adicionales_json = formData.get("horarios_adicionales") as string

        if (tipo_lugar && tipo_lugar !== "") {
            rawData.tipo_lugar = tipo_lugar
        }
        if (barrio_privado !== null) {
            rawData.barrio_privado = barrio_privado === "true" || barrio_privado === "on"
        }
        if (conserjeria !== null) {
            rawData.conserjeria = conserjeria === "true" || conserjeria === "on"
        }
        if (nombre_lugar) {
            rawData.nombre_lugar = nombre_lugar || null
        }
        const horario_24hs_value = horario_24hs === "true" || horario_24hs === "on"
        
        // Always set horario_24hs
        rawData.horario_24hs = horario_24hs_value
        
        // Only include horario_apertura and horario_cierre if not 24hs
        if (!horario_24hs_value) {
            if (horario_apertura) {
                rawData.horario_apertura = horario_apertura
            }
            if (horario_cierre) {
                rawData.horario_cierre = horario_cierre
            }
        } else {
            // If 24hs, set to null/undefined
            rawData.horario_apertura = null
            rawData.horario_cierre = null
        }
        if (horarios_adicionales_json) {
            try {
                rawData.horarios_adicionales = JSON.parse(horarios_adicionales_json)
            } catch {
                // Invalid JSON, skip
            }
        }

        // Validate with Zod
        const validationResult = direccionExtraInfoSchema.safeParse(rawData)

        if (!validationResult.success) {
            return {
                success: false,
                error: formatZodErrors(validationResult.error)
            }
        }

        const extraInfoData = validationResult.data
        const direccion = await updateDireccion(id, extraInfoData)

        return {
            success: true,
            error: null,
            data: direccion
        }
    } catch (error: unknown) {
        console.error("Error updating direccion extra info:", error)
        return {
            success: false,
            error: getErrorMessage(error, "Error al actualizar la información extra de la dirección")
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