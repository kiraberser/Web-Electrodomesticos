'use server'

import axios from "axios";
import { cookies } from "next/headers";
import { Service } from "@/types/service";

const URL = process.env.NEXT_PUBLIC_BASE_URL_API

export const getAllServices = async (page: number = 1, pageSize: number = 10, search?: string) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value

    const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
    })
    if (search) params.append('search', search)

    const url = `${URL}/servicios/?${params.toString()}`
    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        // Enable Next.js caching per URL
        next: { revalidate: 60 },
        cache: 'force-cache',
    })

    if (!res.ok) throw new Error('Failed to fetch services')
    const data = await res.json()

    return {
        data: data.results,
        success: true,
        status: res.status,
        pagination: {
            count: data.count,
            next: data.next,
            previous: data.previous,
            currentPage: page,
            totalPages: Math.ceil(data.count / pageSize),
            pageSize,
        },
    }
}

export const createService = async (serviceData: Service) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    const response = await axios.post(`${URL}/servicios/nuevo/`, serviceData, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    });

    if (response.status !== 201) {
        throw new Error('Failed to create service');
    }

    return { data: response.data, status: response.status };
};

export const getServiceById = async (id: string) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    const response = await axios.get(`${URL}/servicios/${id}/`, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    });
    if (response.status !== 200) {
        throw new Error('Failed to fetch service');
    }
    return { data: response.data, status: response.status };
}

export const updateServiceNote = async (id: string, note: any) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    const response = await axios.patch(`${URL}/servicios/${id}/`, { nota: note }, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    });
    if (response.status !== 200) {
        throw new Error('Failed to update service note');
    }
    return { data: response.data, status: response.status };
}

export const updateService = async (serviceData: Service) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    await axios.put(`${URL}/servicios/${serviceData.noDeServicio}/`, serviceData, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    });
}

export const deleteService = async (id: string) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    const response = await axios.delete(`${URL}/servicios/${id}/`, {
        headers: {
            "Content-type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    });
    if (response.status !== 204) {
        throw new Error('Failed to delete service');
    }
}

// Create a sale record for a service note (VentasServicios)
export const createServiceSale = async (payload: {
    servicio: number
    mano_obra: number
    refacciones_total: number
    total?: number
    observaciones?: string
    tecnico?: string
    garantia_dias?: number
    estado_pago?: 'Pendiente' | 'Parcial' | 'Pagado'
}) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    const response = await axios.post(`${URL}/ventas/registros-servicios/`, payload, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    });

    if (response.status !== 201 && response.status !== 200) {
        throw new Error('Failed to create service sale');
    }

    return { data: response.data, status: response.status };
}

export const getServiceSaleByService = async (servicioId: string) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    const response = await axios.get(`${URL}/ventas/registros-servicios/?servicio=${servicioId}`, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    });

    if (response.status !== 200) {
        throw new Error('Failed to fetch service sale')
    }

    return { data: response.data, status: response.status }
}