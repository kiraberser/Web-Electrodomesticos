'use server'

import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_API

export const subscribeNewsletter = async (email: string) => {
    const url = `${BASE_URL}/common/newsletters/`
    try {
        const res = await axios.post(url, { email }, {
            headers: { 'Content-Type': 'application/json' },
        })
        return { success: true, status: res.status, data: res.data }
    } catch (error: unknown) {
        let status = 500
        let data: { message: string } = { message: 'Error inesperado' }
        
        if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object') {
            if ('status' in error.response && typeof error.response.status === 'number') {
                status = error.response.status
            }
            if ('data' in error.response) {
                const errorData = error.response.data
                if (errorData && typeof errorData === 'object' && 'message' in errorData && typeof errorData.message === 'string') {
                    data = { message: errorData.message }
                } else if (errorData && typeof errorData === 'object') {
                    // Si hay data pero no tiene message, intentar extraer un mensaje
                    const errorMessage = JSON.stringify(errorData)
                    data = { message: errorMessage.length > 200 ? 'Error en la solicitud' : errorMessage }
                }
            }
        }
        
        return { success: false, status, data }
    }
}


