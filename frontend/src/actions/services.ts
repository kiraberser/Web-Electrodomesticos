"use server"

import { Service } from "@/types/service"
import { serviceSchema } from "@/schemas/serviceSchema"
import { 
    getServiceById, 
    updateService as putService, 
    createService as postService, 
    deleteService, 
    createServiceSale, 
    updateServiceNote 
} from "@/api/services"

type ActionState = {
    success: boolean;
    error: string | null;
    data?: unknown;
}

// Helper function to safely extract error message
function getErrorMessage(error: unknown, defaultMessage: string): string {
    if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        return error.message
    }
    return defaultMessage
}

export const getServiceAction = async (id: string): Promise<ActionState> => {
    try {
        const response = await getServiceById(id)
        return { 
            success: true, 
            error: null,
            data: response.data 
        }
    } catch (error: unknown) {
        console.error("Error fetching service:", error)
        return { 
            success: false, 
            error: getErrorMessage(error, "Error al obtener el servicio")
        }
    }
}

export const createService = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    const data = Object.fromEntries(formData.entries())

    const parsedData = serviceSchema.safeParse(data)
    console.log("Parsed data:", parsedData)

    if (!parsedData.success) {
        console.error("Validation errors found:", parsedData.error.format())
        return { 
            success: false, 
            error: parsedData.error.format() 
        }
    }

    const newService: Service = {
        ...parsedData.data,
        noDeServicio: Number(parsedData.data.noDeServicio),
    }
    console.log("Creating service:", newService)
    try {
        await postService(newService)
        return { success: true, error: null }
    } catch (error: unknown) {
        console.error("Error creating service:", error)
        return { 
            success: false, 
            error: getErrorMessage(error, "Error al crear el servicio")
        }
    }
}

export const updateServiceAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    const data = Object.fromEntries(formData.entries())
    
    const parsedData = serviceSchema.safeParse(data)
    
    if (!parsedData.success) {
        console.error("Validation errors found:", parsedData.error.format())
        return { 
            success: false, 
            error: parsedData.error.format() 
        }
    }

    const updatedService: Service = {
        ...parsedData.data,
        noDeServicio: Number(parsedData.data.noDeServicio),
    }
    
    try {
        await putService(updatedService)
        return { 
            success: true, 
            error: null,
            data: updatedService 
        }
    } catch (error: unknown) {
        console.error("Error updating service:", error)
        return { 
            success: false, 
            error: getErrorMessage(error, "Error al actualizar el servicio")
        }
    }
}

export const deleteServiceAction = async (id: string): Promise<ActionState> => {
    try {
        await deleteService(id)
        return { success: true, error: null }
    } catch (error: unknown) {
        console.error("Error deleting service:", error)
        return { 
            success: false, 
            error: getErrorMessage(error, "Error al eliminar el servicio")
        }
    }
}

export const createServiceSaleAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    try {
        const servicio = Number(formData.get('servicio'))
        const mano_obra = Number(formData.get('mano_obra')) || 0
        let refacciones_total = Number(formData.get('refacciones_total')) || 0
        const total = Number(formData.get('total')) || mano_obra + refacciones_total
        const observaciones = (formData.get('observaciones') as string) || ''
        const tecnico = (formData.get('tecnico') as string) || undefined
        const garantia_dias = Number(formData.get('garantia_dias')) || 30
        const estado_pago = (formData.get('estado_pago') as 'Pendiente' | 'Parcial' | 'Pagado') || 'Pendiente'
        // Parts detail (name, quantity, price, total)
        let parts: Array<{ name: string; quantity: number; price: number; total: number }> = []
        const partsRaw = formData.get('parts') as string | null
        if (partsRaw) {
            try { parts = JSON.parse(partsRaw) || [] } catch { parts = [] }
        }
        if (!refacciones_total && parts.length) {
            refacciones_total = parts.reduce((sum, p) => sum + (Number(p.total) || (Number(p.quantity) * Number(p.price) || 0)), 0)
        }

        if (!servicio) {
            return { success: false, error: 'ID de servicio inválido' }
        }

        const payload = {
            servicio,
            mano_obra,
            refacciones_total,
            total,
            observaciones,
            tecnico,
            garantia_dias,
            estado_pago,
        }

        const res = await createServiceSale(payload)

        // Update snapshot note on Servicio for fast reads from /servicios/:id/
        const noteSnapshot = {
            laborCost: mano_obra,
            partsCost: refacciones_total,
            totalCost: total,
            notes: observaciones,
            technician: tecnico,
            warranty: garantia_dias,
            paymentStatus: estado_pago,
            parts,
        }
        await updateServiceNote(String(servicio), noteSnapshot)

        return { success: true, error: null, data: res.data }
    } catch (error: unknown) {
        console.error('Error creating service sale:', error)
        return { success: false, error: getErrorMessage(error, 'Error al crear la venta del servicio') }
    }
}
