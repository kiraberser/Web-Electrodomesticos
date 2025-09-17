"use server"

import { subscribeNewsletter } from "@/api/newsletter"

type ActionState = {
    success: boolean
    error: any
    data?: any
}

export const subscribeNewsletterAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    const email = String(formData.get('email') || '').trim().toLowerCase()
    if (!email) {
        return { success: false, error: 'Email es requerido' }
    }
    const res = await subscribeNewsletter(email)
    console.log("Res:", res)
    if (!res.success) {
        const message = res.data?.errors?.email?.[0] || res.data?.email || 'No fue posible suscribirse'
        return { success: false, error: message }
    }
    return { success: true, error: null, data: res.data }
}


