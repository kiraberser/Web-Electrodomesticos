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
        const status = error?.response?.status || 500
        const data = error?.response?.data || { message: 'Error inesperado' }
        return { success: false, status, data }
    }
}


