'use server'

import {
    createMarca as postMarca,
    updateMarca as putMarca,
    createCategoria as postCategoria,
    updateCategoria as putCategoria,
    createProveedor as postProveedor,
    updateProveedor as putProveedor,
    createRefaccion as postRefaccion,
    updateRefaccion as putRefaccion,
    type Marca,
    type Categoria,
    type Proveedor,
    type Refaccion
} from "@/api/productos"
import { uploadImage } from "@/lib/cloudinary"

type ActionState = {
    success: boolean
    error: any
    data?: any
}

// ========== MARCAS ==========

export const createMarcaAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    const nombre = ((formData.get("nombre") as string) || "").trim()
    const pais_origen = ((formData.get("pais_origen") as string) || "").trim()
    const logoFile = formData.get("logo") as File | null

    // Validaciones
    const fieldErrors: Record<string, { _errors: string[] }> = {}
    
    if (!nombre) {
        fieldErrors.nombre = { _errors: ["El nombre es requerido"] }
    }

    if (Object.keys(fieldErrors).length > 0) {
        return { 
            success: false, 
            error: fieldErrors
        }
    }

    try {
        // Subir logo a Cloudinary si se proporcionó
        let logoUrl: string | undefined
        if (logoFile && logoFile.size > 0) {
            try {
                logoUrl = await uploadImage(logoFile)
                console.log("Logo uploaded successfully:", logoUrl)
            } catch (uploadError) {
                console.error("Error uploading logo:", uploadError)
                return { 
                    success: false, 
                    error: "Error al subir el logo" 
                }
            }
        }

        const marcaData: Marca = {
            nombre,
            pais_origen: pais_origen || undefined,
            logo: logoUrl
        }

        const response = await postMarca(marcaData)
        return { 
            success: true, 
            error: null,
            data: response.data
        }
    } catch (error: any) {
        console.error("Error creating marca:", error)
        return { 
            success: false, 
            error: error.response?.data?.nombre?.[0] || error.message || "Error al crear la marca" 
        }
    }
}

export const updateMarcaAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    const id = Number(formData.get("id"))
    const nombre = ((formData.get("nombre") as string) || "").trim()
    const pais_origen = ((formData.get("pais_origen") as string) || "").trim()
    const logoFile = formData.get("logo") as File | null

    // Validaciones
    const fieldErrors: Record<string, { _errors: string[] }> = {}
    
    if (!id) {
        return { success: false, error: "ID de marca inválido" }
    }

    if (!nombre) {
        fieldErrors.nombre = { _errors: ["El nombre es requerido"] }
    }

    if (Object.keys(fieldErrors).length > 0) {
        return { 
            success: false, 
            error: fieldErrors
        }
    }

    try {
        // Subir logo a Cloudinary si se proporcionó uno nuevo
        let logoUrl: string | undefined
        if (logoFile && logoFile.size > 0) {
            try {
                logoUrl = await uploadImage(logoFile)
                console.log("Logo uploaded successfully:", logoUrl)
            } catch (uploadError) {
                console.error("Error uploading logo:", uploadError)
                return { 
                    success: false, 
                    error: "Error al subir el logo" 
                }
            }
        }

        const marcaData: Marca = {
            nombre,
            pais_origen: pais_origen || undefined,
            ...(logoUrl && { logo: logoUrl })
        }

        const response = await putMarca(id, marcaData)
        return { 
            success: true, 
            error: null,
            data: response.data
        }
    } catch (error: any) {
        console.error("Error updating marca:", error)
        return { 
            success: false, 
            error: error.response?.data?.nombre?.[0] || error.message || "Error al actualizar la marca" 
        }
    }
}

// ========== CATEGORÍAS ==========

export const createCategoriaAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    const nombre = ((formData.get("nombre") as string) || "").trim()
    const descripcion = ((formData.get("descripcion") as string) || "").trim()
    const imagenFile = formData.get("imagen") as File | null

    // Validaciones
    const fieldErrors: Record<string, { _errors: string[] }> = {}
    
    if (!nombre) {
        fieldErrors.nombre = { _errors: ["El nombre es requerido"] }
    }

    if (Object.keys(fieldErrors).length > 0) {
        return { 
            success: false, 
            error: fieldErrors
        }
    }

    try {
        // Subir imagen a Cloudinary si se proporcionó
        let imagenUrl: string | undefined
        if (imagenFile && imagenFile.size > 0) {
            try {
                imagenUrl = await uploadImage(imagenFile)
                console.log("Image uploaded successfully:", imagenUrl)
            } catch (uploadError) {
                console.error("Error uploading image:", uploadError)
                return { 
                    success: false, 
                    error: "Error al subir la imagen" 
                }
            }
        }

        const categoriaData: Categoria = {
            nombre,
            descripcion: descripcion || undefined,
            imagen: imagenUrl
        }

        const response = await postCategoria(categoriaData)
        return { 
            success: true, 
            error: null,
            data: response.data
        }
    } catch (error: any) {
        console.error("Error creating categoria:", error)
        return { 
            success: false, 
            error: error.response?.data?.nombre?.[0] || error.message || "Error al crear la categoría" 
        }
    }
}

export const updateCategoriaAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    const id = Number(formData.get("id"))
    const nombre = ((formData.get("nombre") as string) || "").trim()
    const descripcion = ((formData.get("descripcion") as string) || "").trim()
    const imagenFile = formData.get("imagen") as File | null

    // Validaciones
    const fieldErrors: Record<string, { _errors: string[] }> = {}
    
    if (!id) {
        return { success: false, error: "ID de categoría inválido" }
    }

    if (!nombre) {
        fieldErrors.nombre = { _errors: ["El nombre es requerido"] }
    }

    if (Object.keys(fieldErrors).length > 0) {
        return { 
            success: false, 
            error: fieldErrors
        }
    }

    try {
        // Subir imagen a Cloudinary si se proporcionó una nueva
        let imagenUrl: string | undefined
        if (imagenFile && imagenFile.size > 0) {
            try {
                imagenUrl = await uploadImage(imagenFile)
                console.log("Image uploaded successfully:", imagenUrl)
            } catch (uploadError) {
                console.error("Error uploading image:", uploadError)
                return { 
                    success: false, 
                    error: "Error al subir la imagen" 
                }
            }
        }

        const categoriaData: Categoria = {
            nombre,
            descripcion: descripcion || undefined,
            ...(imagenUrl && { imagen: imagenUrl })
        }

        const response = await putCategoria(id, categoriaData)
        return { 
            success: true, 
            error: null,
            data: response.data
        }
    } catch (error: any) {
        console.error("Error updating categoria:", error)
        return { 
            success: false, 
            error: error.response?.data?.nombre?.[0] || error.message || "Error al actualizar la categoría" 
        }
    }
}

// ========== PROVEEDORES ==========

export const createProveedorAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    const nombre = ((formData.get("nombre") as string) || "").trim()
    const contacto = ((formData.get("contacto") as string) || "").trim()
    const telefono = ((formData.get("telefono") as string) || "").trim()
    const correo_electronico = ((formData.get("correo_electronico") as string) || "").trim()
    const direccion = ((formData.get("direccion") as string) || "").trim()
    const logoFile = formData.get("logo") as File | null

    // Validaciones
    const fieldErrors: Record<string, { _errors: string[] }> = {}
    
    if (!nombre) {
        fieldErrors.nombre = { _errors: ["El nombre es requerido"] }
    }
    if (!contacto) {
        fieldErrors.contacto = { _errors: ["El contacto es requerido"] }
    }
    if (!telefono) {
        fieldErrors.telefono = { _errors: ["El teléfono es requerido"] }
    }
    if (!correo_electronico) {
        fieldErrors.correo_electronico = { _errors: ["El correo electrónico es requerido"] }
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo_electronico)) {
        fieldErrors.correo_electronico = { _errors: ["Correo electrónico inválido"] }
    }
    if (!direccion) {
        fieldErrors.direccion = { _errors: ["La dirección es requerida"] }
    }

    if (Object.keys(fieldErrors).length > 0) {
        return { 
            success: false, 
            error: fieldErrors
        }
    }

    try {
        // Subir logo a Cloudinary si se proporcionó
        let logoUrl: string | undefined
        if (logoFile && logoFile.size > 0) {
            try {
                logoUrl = await uploadImage(logoFile)
                console.log("Logo uploaded successfully:", logoUrl)
            } catch (uploadError) {
                console.error("Error uploading logo:", uploadError)
                return { 
                    success: false, 
                    error: "Error al subir el logo" 
                }
            }
        }

        const proveedorData: Proveedor = {
            nombre,
            contacto,
            telefono,
            correo_electronico,
            direccion,
            logo: logoUrl
        }

        const response = await postProveedor(proveedorData)
        return { 
            success: true, 
            error: null,
            data: response.data
        }
    } catch (error: any) {
        console.error("Error creating proveedor:", error)
        // Manejo de errores específicos del backend
        const backendError = error.response?.data
        if (backendError?.correo_electronico) {
            return { 
                success: false, 
                error: { correo_electronico: { _errors: [backendError.correo_electronico[0]] } }
            }
        }
        return { 
            success: false, 
            error: error.message || "Error al crear el proveedor" 
        }
    }
}

export const updateProveedorAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    const id = Number(formData.get("id"))
    const nombre = ((formData.get("nombre") as string) || "").trim()
    const contacto = ((formData.get("contacto") as string) || "").trim()
    const telefono = ((formData.get("telefono") as string) || "").trim()
    const correo_electronico = ((formData.get("correo_electronico") as string) || "").trim()
    const direccion = ((formData.get("direccion") as string) || "").trim()
    const logoFile = formData.get("logo") as File | null

    // Validaciones
    const fieldErrors: Record<string, { _errors: string[] }> = {}
    
    if (!id) {
        return { success: false, error: "ID de proveedor inválido" }
    }

    if (!nombre) {
        fieldErrors.nombre = { _errors: ["El nombre es requerido"] }
    }
    if (!contacto) {
        fieldErrors.contacto = { _errors: ["El contacto es requerido"] }
    }
    if (!telefono) {
        fieldErrors.telefono = { _errors: ["El teléfono es requerido"] }
    }
    if (!correo_electronico) {
        fieldErrors.correo_electronico = { _errors: ["El correo electrónico es requerido"] }
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo_electronico)) {
        fieldErrors.correo_electronico = { _errors: ["Correo electrónico inválido"] }
    }
    if (!direccion) {
        fieldErrors.direccion = { _errors: ["La dirección es requerida"] }
    }

    if (Object.keys(fieldErrors).length > 0) {
        return { 
            success: false, 
            error: fieldErrors
        }
    }

    try {
        // Subir logo a Cloudinary si se proporcionó uno nuevo
        let logoUrl: string | undefined
        if (logoFile && logoFile.size > 0) {
            try {
                logoUrl = await uploadImage(logoFile)
                console.log("Logo uploaded successfully:", logoUrl)
            } catch (uploadError) {
                console.error("Error uploading logo:", uploadError)
                return { 
                    success: false, 
                    error: "Error al subir el logo" 
                }
            }
        }

        const proveedorData: Proveedor = {
            nombre,
            contacto,
            telefono,
            correo_electronico,
            direccion,
            ...(logoUrl && { logo: logoUrl })
        }

        const response = await putProveedor(id, proveedorData)
        return { 
            success: true, 
            error: null,
            data: response.data
        }
    } catch (error: any) {
        console.error("Error updating proveedor:", error)
        // Manejo de errores específicos del backend
        const backendError = error.response?.data
        if (backendError?.correo_electronico) {
            return { 
                success: false, 
                error: { correo_electronico: { _errors: [backendError.correo_electronico[0]] } }
            }
        }
        return { 
            success: false, 
            error: error.message || "Error al actualizar el proveedor" 
        }
    }
}

// ========== REFACCIONES ==========

export const createRefaccionAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    const codigo_parte = ((formData.get("codigo_parte") as string) || "").trim()
    const nombre = ((formData.get("nombre") as string) || "").trim()
    const descripcion = ((formData.get("descripcion") as string) || "").trim()
    const marca = ((formData.get("marca") as string) || "").trim()
    const categoria = Number(formData.get("categoria"))
    const proveedor = formData.get("proveedor") ? Number(formData.get("proveedor")) : undefined
    const precio = Number(formData.get("precio"))
    const existencias = Number(formData.get("existencias"))
    const estado = ((formData.get("estado") as string) || "NVO") as 'NVO' | 'UBS' | 'REC'
    const compatibilidad = ((formData.get("compatibilidad") as string) || "").trim()
    const imagenFile = formData.get("imagen") as File | null

    // Validaciones
    const fieldErrors: Record<string, { _errors: string[] }> = {}
    
    if (!codigo_parte) {
        fieldErrors.codigo_parte = { _errors: ["El código de parte es requerido"] }
    }
    if (!nombre) {
        fieldErrors.nombre = { _errors: ["El nombre es requerido"] }
    }
    if (!marca) {
        fieldErrors.marca = { _errors: ["La marca es requerida"] }
    }
    if (!categoria || isNaN(categoria)) {
        fieldErrors.categoria = { _errors: ["Selecciona una categoría válida"] }
    }
    if (isNaN(precio) || precio < 0) {
        fieldErrors.precio = { _errors: ["El precio debe ser un número válido mayor o igual a 0"] }
    }
    if (isNaN(existencias) || existencias < 0) {
        fieldErrors.existencias = { _errors: ["Las existencias deben ser un número válido mayor o igual a 0"] }
    }
    if (!estado || !['NVO', 'UBS', 'REC'].includes(estado)) {
        fieldErrors.estado = { _errors: ["Selecciona un estado válido"] }
    }
    if (!compatibilidad) {
        fieldErrors.compatibilidad = { _errors: ["La compatibilidad es requerida"] }
    }

    if (Object.keys(fieldErrors).length > 0) {
        return { 
            success: false, 
            error: fieldErrors
        }
    }

    try {
        // Subir imagen a Cloudinary si se proporcionó
        let imagenUrl: string | undefined
        if (imagenFile && imagenFile.size > 0) {
            try {
                imagenUrl = await uploadImage(imagenFile)
                console.log("Image uploaded successfully:", imagenUrl)
            } catch (uploadError) {
                console.error("Error uploading image:", uploadError)
                return { 
                    success: false, 
                    error: "Error al subir la imagen" 
                }
            }
        }

        const refaccionData: Refaccion = {
            codigo_parte,
            nombre,
            descripcion: descripcion || undefined,
            marca,
            categoria,
            proveedor,
            precio,
            existencias,
            estado,
            compatibilidad,
            imagen: imagenUrl
        }

        const response = await postRefaccion(refaccionData)
        return { 
            success: true, 
            error: null,
            data: response.data
        }
    } catch (error: any) {
        console.error("Error creating refaccion:", error)
        // Manejo de errores específicos del backend
        const backendError = error.response?.data
        if (backendError?.codigo_parte) {
            return { 
                success: false, 
                error: { codigo_parte: { _errors: [backendError.codigo_parte[0]] } }
            }
        }
        return { 
            success: false, 
            error: error.message || "Error al crear la refacción" 
        }
    }
}

export const updateRefaccionAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    const id = Number(formData.get("id"))
    const codigo_parte = ((formData.get("codigo_parte") as string) || "").trim()
    const nombre = ((formData.get("nombre") as string) || "").trim()
    const descripcion = ((formData.get("descripcion") as string) || "").trim()
    const marca = ((formData.get("marca") as string) || "").trim()
    const categoria = Number(formData.get("categoria"))
    const proveedor = formData.get("proveedor") ? Number(formData.get("proveedor")) : undefined
    const precio = Number(formData.get("precio"))
    const existencias = Number(formData.get("existencias"))
    const estado = ((formData.get("estado") as string) || "NVO") as 'NVO' | 'UBS' | 'REC'
    const compatibilidad = ((formData.get("compatibilidad") as string) || "").trim()
    const imagenFile = formData.get("imagen") as File | null

    // Validaciones
    const fieldErrors: Record<string, { _errors: string[] }> = {}
    
    if (!id) {
        return { success: false, error: "ID de refacción inválido" }
    }

    if (!codigo_parte) {
        fieldErrors.codigo_parte = { _errors: ["El código de parte es requerido"] }
    }
    if (!nombre) {
        fieldErrors.nombre = { _errors: ["El nombre es requerido"] }
    }
    if (!marca) {
        fieldErrors.marca = { _errors: ["La marca es requerida"] }
    }
    if (!categoria || isNaN(categoria)) {
        fieldErrors.categoria = { _errors: ["Selecciona una categoría válida"] }
    }
    if (isNaN(precio) || precio < 0) {
        fieldErrors.precio = { _errors: ["El precio debe ser un número válido mayor o igual a 0"] }
    }
    if (isNaN(existencias) || existencias < 0) {
        fieldErrors.existencias = { _errors: ["Las existencias deben ser un número válido mayor o igual a 0"] }
    }
    if (!estado || !['NVO', 'UBS', 'REC'].includes(estado)) {
        fieldErrors.estado = { _errors: ["Selecciona un estado válido"] }
    }
    if (!compatibilidad) {
        fieldErrors.compatibilidad = { _errors: ["La compatibilidad es requerida"] }
    }

    if (Object.keys(fieldErrors).length > 0) {
        return { 
            success: false, 
            error: fieldErrors
        }
    }

    try {
        // Subir imagen a Cloudinary si se proporcionó una nueva
        let imagenUrl: string | undefined
        if (imagenFile && imagenFile.size > 0) {
            try {
                imagenUrl = await uploadImage(imagenFile)
            } catch (uploadError) {
                console.error("Error uploading image:", uploadError)
                return { 
                    success: false, 
                    error: "Error al subir la imagen" 
                }
            }
        }

        const refaccionData: Refaccion = {
            codigo_parte,
            nombre,
            descripcion: descripcion || undefined,
            marca,
            categoria,
            proveedor,
            precio,
            existencias,
            estado,
            compatibilidad,
            ...(imagenUrl && { imagen: imagenUrl })
        }

        const response = await putRefaccion(id, refaccionData)
        return { 
            success: true, 
            error: null,
            data: response.data
        }
    } catch (error: any) {
        console.error("Error updating refaccion:", error)
        // Manejo de errores específicos del backend
        const backendError = error.response?.data
        if (backendError?.codigo_parte) {
            return { 
                success: false, 
                error: { codigo_parte: { _errors: [backendError.codigo_parte[0]] } }
            }
        }
        return { 
            success: false, 
            error: error.message || "Error al actualizar la refacción" 
        }
    }
}

