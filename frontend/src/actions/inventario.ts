'use server'

import {
    registrarEntrada,
    registrarSalida,
    registrarDevolucion,
} from "@/api/inventario"

export type ActionState = {
    success: boolean
    error: string | null | Record<string, { _errors: string[] }> | unknown
    data?: unknown
}

function getErrorMessage(error: unknown, defaultMessage: string): string {
    if (error && typeof error === 'object') {
        if ('response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
            const data = error.response.data
            if (data && typeof data === 'object') {
                if ('detail' in data) {
                    const detail = data.detail
                    if (Array.isArray(detail)) return detail[0]
                    if (typeof detail === 'string') return detail
                }
                if ('non_field_errors' in data && Array.isArray(data.non_field_errors)) {
                    return String(data.non_field_errors[0])
                }
            }
        }
        if ('message' in error && typeof error.message === 'string') {
            return error.message
        }
    }
    return defaultMessage
}

// ========== ENTRADA ==========

export const registrarEntradaAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    const refaccion = Number(formData.get("refaccion"))
    const cantidad = Number(formData.get("cantidad"))
    const precioRaw = formData.get("precio_unitario")
    const precio_unitario = precioRaw ? Number(precioRaw) : undefined
    const observaciones = ((formData.get("observaciones") as string) || "").trim() || undefined

    const fieldErrors: Record<string, { _errors: string[] }> = {}

    if (!refaccion || isNaN(refaccion)) {
        fieldErrors.refaccion = { _errors: ["Selecciona una refaccion"] }
    }
    if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
        fieldErrors.cantidad = { _errors: ["La cantidad debe ser mayor a 0"] }
    }
    if (precio_unitario !== undefined && (isNaN(precio_unitario) || precio_unitario < 0)) {
        fieldErrors.precio_unitario = { _errors: ["El precio debe ser un numero valido"] }
    }

    if (Object.keys(fieldErrors).length > 0) {
        return { success: false, error: fieldErrors }
    }

    try {
        const response = await registrarEntrada({
            refaccion,
            cantidad,
            ...(precio_unitario !== undefined && { precio_unitario }),
            ...(observaciones !== undefined && { observaciones }),
        })
        return { success: true, error: null, data: response.data }
    } catch (error: unknown) {
        console.error("Error registrando entrada:", error)
        return {
            success: false,
            error: getErrorMessage(error, "Error al registrar la entrada"),
        }
    }
}

// ========== SALIDA ==========

export const registrarSalidaAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    const refaccion = Number(formData.get("refaccion"))
    const cantidad = Number(formData.get("cantidad"))

    const fieldErrors: Record<string, { _errors: string[] }> = {}

    if (!refaccion || isNaN(refaccion)) {
        fieldErrors.refaccion = { _errors: ["Selecciona una refaccion"] }
    }
    if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
        fieldErrors.cantidad = { _errors: ["La cantidad debe ser mayor a 0"] }
    }

    if (Object.keys(fieldErrors).length > 0) {
        return { success: false, error: fieldErrors }
    }

    try {
        const response = await registrarSalida({ refaccion, cantidad })
        return { success: true, error: null, data: response.data }
    } catch (error: unknown) {
        console.error("Error registrando salida:", error)
        return {
            success: false,
            error: getErrorMessage(error, "Error al registrar la salida"),
        }
    }
}

// ========== DEVOLUCION ==========

export const registrarDevolucionAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    const refaccion = Number(formData.get("refaccion"))
    const cantidad = Number(formData.get("cantidad"))
    const ventaIdRaw = formData.get("venta_id")
    const venta_id = ventaIdRaw ? Number(ventaIdRaw) : undefined
    const motivo = ((formData.get("motivo") as string) || "").trim() || undefined
    const precioRaw = formData.get("precio_unitario")
    const precio_unitario = precioRaw ? Number(precioRaw) : undefined
    const observaciones = ((formData.get("observaciones") as string) || "").trim() || undefined

    const fieldErrors: Record<string, { _errors: string[] }> = {}

    if (!refaccion || isNaN(refaccion)) {
        fieldErrors.refaccion = { _errors: ["Selecciona una refaccion"] }
    }
    if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
        fieldErrors.cantidad = { _errors: ["La cantidad debe ser mayor a 0"] }
    }

    if (Object.keys(fieldErrors).length > 0) {
        return { success: false, error: fieldErrors }
    }

    try {
        const response = await registrarDevolucion({
            refaccion,
            cantidad,
            ...(precio_unitario !== undefined && { precio_unitario }),
            ...(venta_id !== undefined && { venta_id }),
            ...(motivo !== undefined && { motivo }),
            ...(observaciones !== undefined && { observaciones }),
        })
        return { success: true, error: null, data: response.data }
    } catch (error: unknown) {
        console.error("Error registrando devolucion:", error)
        return {
            success: false,
            error: getErrorMessage(error, "Error al registrar la devolucion"),
        }
    }
}
