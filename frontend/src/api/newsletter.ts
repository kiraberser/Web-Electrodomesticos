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
        let data = { message: 'Error inesperado' }
        
        if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object') {
            if ('status' in error.response && typeof error.response.status === 'number') {
                status = error.response.status
            }
            if ('data' in error.response) {
                data = error.response.data as { message?: string }
            }
        }
        
        return { success: false, status, data }
    }
}


