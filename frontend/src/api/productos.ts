'use server'

import axios from "axios";
import { cookies } from "next/headers";

const URL = process.env.NEXT_PUBLIC_BASE_URL_API

// Types
export interface Marca {
    id?: number;
    nombre: string;
    pais_origen?: string;
    logo?: string;
}

export interface Categoria {
    id?: number;
    nombre: string;
    descripcion?: string;
    imagen?: string;
}

export interface Proveedor {
    id?: number;
    nombre: string;
    contacto: string;
    telefono: string;
    correo_electronico: string;
    direccion: string;
    logo?: string;
}

export interface Refaccion {
    id?: number;
    codigo_parte: string;
    nombre: string;
    descripcion?: string;
    marca: string;
    categoria: number;
    proveedor?: number;
    precio: number;
    existencias: number;
    estado: 'NVO' | 'UBS' | 'REC';
    compatibilidad: string;
    imagen?: string;
    fecha_ingreso?: string;
    ultima_actualizacion?: string;
    marca_nombre?: string;
    categoria_nombre?: string;
}

// Helper para obtener token
async function getAuthHeaders() {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }
}

// ========== MARCAS ==========

export const getAllMarcas = async (search?: string) => {
    const headers = await getAuthHeaders()
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    
    const url = `${URL}/productos/marcas/${params.toString() ? '?' + params.toString() : ''}`
    const response = await fetch(url, {
        headers,
        next: { revalidate: 30 },
    })

    if (!response.ok) throw new Error('Failed to fetch marcas')
    const data = await response.json()
    // Si viene con paginación, devolver solo results, si no, devolver data directamente
    return data.results || data
}

export const createMarca = async (marcaData: Marca) => {
    const headers = await getAuthHeaders()
    const response = await axios.post(`${URL}/productos/marcas/`, marcaData, { headers })
    
    if (response.status !== 201) {
        throw new Error('Failed to create marca')
    }
    
    return { data: response.data, status: response.status }
}

export const updateMarca = async (id: number, marcaData: Marca) => {
    const headers = await getAuthHeaders()
    const response = await axios.put(`${URL}/productos/marcas/${id}/`, marcaData, { headers })
    return { data: response.data, status: response.status }
}

export const deleteMarca = async (id: number) => {
    const headers = await getAuthHeaders()
    const response = await axios.delete(`${URL}/productos/marcas/${id}/`, { headers })
    
    if (response.status !== 204) {
        throw new Error('Failed to delete marca')
    }
}

// ========== CATEGORÍAS ==========

export const getAllCategorias = async (search?: string) => {
    const headers = await getAuthHeaders()
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    
    const url = `${URL}/productos/categorias/${params.toString() ? '?' + params.toString() : ''}`
    const response = await fetch(url, {
        headers,
        next: { revalidate: 30 },
    })

    if (!response.ok) throw new Error('Failed to fetch categorias')
    const data = await response.json()
    return data.results || data
}

export const createCategoria = async (categoriaData: Categoria) => {
    const headers = await getAuthHeaders()
    const response = await axios.post(`${URL}/productos/categorias/`, categoriaData, { headers })
    
    if (response.status !== 201) {
        throw new Error('Failed to create categoria')
    }
    
    return { data: response.data, status: response.status }
}

export const updateCategoria = async (id: number, categoriaData: Categoria) => {
    const headers = await getAuthHeaders()
    const response = await axios.put(`${URL}/productos/categorias/${id}/`, categoriaData, { headers })
    return { data: response.data, status: response.status }
}

export const deleteCategoria = async (id: number) => {
    const headers = await getAuthHeaders()
    const response = await axios.delete(`${URL}/productos/categorias/${id}/`, { headers })
    
    if (response.status !== 204) {
        throw new Error('Failed to delete categoria')
    }
}

// ========== PROVEEDORES ==========

export const getAllProveedores = async (search?: string) => {
    const headers = await getAuthHeaders()
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    
    const url = `${URL}/productos/proveedores/${params.toString() ? '?' + params.toString() : ''}`
    const response = await fetch(url, {
        headers,
        next: { revalidate: 30 },
    })

    if (!response.ok) throw new Error('Failed to fetch proveedores')
    const data = await response.json()
    return data.results || data
}

export const createProveedor = async (proveedorData: Proveedor) => {
    const headers = await getAuthHeaders()
    const response = await axios.post(`${URL}/productos/proveedores/`, proveedorData, { headers })
    
    if (response.status !== 201) {
        throw new Error('Failed to create proveedor')
    }
    
    return { data: response.data, status: response.status }
}

export const updateProveedor = async (id: number, proveedorData: Proveedor) => {
    const headers = await getAuthHeaders()
    const response = await axios.put(`${URL}/productos/proveedores/${id}/`, proveedorData, { headers })
    return { data: response.data, status: response.status }
}

export const deleteProveedor = async (id: number) => {
    const headers = await getAuthHeaders()
    const response = await axios.delete(`${URL}/productos/proveedores/${id}/`, { headers })
    
    if (response.status !== 204) {
        throw new Error('Failed to delete proveedor')
    }
}

// ========== REFACCIONES ==========

export const getAllRefacciones = async (search?: string, categoria?: number, estado?: string) => {
    const headers = await getAuthHeaders()
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (categoria) params.append('categoria', String(categoria))
    if (estado) params.append('estado', estado)
    
    const url = `${URL}/productos/refacciones/${params.toString() ? '?' + params.toString() : ''}`
    const response = await fetch(url, {
        headers,
        next: { revalidate: 30 },
    })

    if (!response.ok) throw new Error('Failed to fetch refacciones')
    const data = await response.json()
    return data.results || data
}

export const getRefaccionById = async (id: number) => {
    const headers = await getAuthHeaders()
    const response = await axios.get(`${URL}/productos/refacciones/${id}/`, { headers })
    
    if (response.status !== 200) {
        throw new Error('Failed to fetch refaccion')
    }
    
    return { data: response.data, status: response.status }
}

/**
 * Obtiene una refacción por su código de parte (slug)
 * Usa el search filter del backend que busca en código_parte
 */
export const getRefaccionByCodigoParte = async (codigoParte: string) => {
    try {
        const url = `${URL}/productos/refacciones/?search=${encodeURIComponent(codigoParte)}`
        const response = await axios.get(url)
        
        if (response.status !== 200) {
            throw new Error('Failed to fetch refaccion by codigo')
        }
        
        // El search puede devolver múltiples resultados, tomamos el primero que coincida exactamente
        const refacciones = response.data.results || response.data
        const refaccion = Array.isArray(refacciones) 
            ? refacciones.find((r: Refaccion) => r.codigo_parte === codigoParte) || refacciones[0]
            : refacciones
        
        if (!refaccion) {
            throw new Error('Refaccion not found')
        }
        
        return refaccion
    } catch (error) {
        console.error('Error fetching refaccion by codigo:', error)
        throw error
    }
}

export const createRefaccion = async (refaccionData: Refaccion) => {
    const headers = await getAuthHeaders()
    const response = await axios.post(`${URL}/productos/refacciones/`, refaccionData, { headers })
    
    if (response.status !== 201) {
        throw new Error('Failed to create refaccion')
    }
    
    return { data: response.data, status: response.status }
}

export const updateRefaccion = async (id: number, refaccionData: Refaccion) => {
    const headers = await getAuthHeaders()
    const response = await axios.put(`${URL}/productos/refacciones/${id}/`, refaccionData, { headers })
    return { data: response.data, status: response.status }
}

export const deleteRefaccion = async (id: number) => {
    const headers = await getAuthHeaders()
    const response = await axios.delete(`${URL}/productos/refacciones/${id}/`, { headers })
    
    if (response.status !== 204) {
        throw new Error('Failed to delete refaccion')
    }
}

// ========== REFACCIONES POR CATEGORÍA ==========

export interface RefaccionesPorCategoriaResponse {
    categoria: Categoria;
    refacciones: Refaccion[];
    total: number;
}

/**
 * Obtiene todas las refacciones (productos) de una categoría específica
 * @param id_category - ID de la categoría
 * @param marca - Filtro opcional por marca
 * @param estado - Filtro opcional por estado
 * @returns Objeto con la categoría, lista de refacciones y total
 */
export const getRefaccionesByCategoria = async (
    id_category: number,
    marca?: string,
    estado?: string
): Promise<RefaccionesPorCategoriaResponse> => {
    try {
        const params = new URLSearchParams()
        
        if (marca) params.append('marca', marca)
        if (estado) params.append('estado', estado)
        
        const url = `${URL}/productos/categorias/${id_category}/refacciones/${params.toString() ? '?' + params.toString() : ''}`
        
        const response = await axios.get(url)

        if (response.status !== 200) {
            throw new Error(`Failed to fetch refacciones for categoria ${id_category}`)
        }

        const data = response.data
        return data
} catch (error) {
        console.error('Error fetching refacciones by categoria:', error)
        throw error
    }
}
