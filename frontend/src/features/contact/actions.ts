'use server'

const BASE = process.env.NEXT_PUBLIC_BASE_URL_API

export type ContactFormData = {
    name: string
    email: string
    subject: string
    message: string
    phone?: string
    priority?: string
}

export type ContactResult = {
    success: boolean
    error?: string
}

export async function submitContactForm(data: ContactFormData): Promise<ContactResult> {
    const body = {
        name: data.name,
        email: data.email,
        // Combine subject + message since the backend only has one message field
        message: data.subject ? `[${data.subject}] ${data.message}` : data.message,
    }

    try {
        const res = await fetch(`${BASE}/common/contacts/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            return { success: false, error: err.message ?? 'Error al enviar el mensaje. Inténtalo de nuevo.' }
        }

        return { success: true }
    } catch {
        return { success: false, error: 'No fue posible conectarse. Verifica tu conexión e inténtalo de nuevo.' }
    }
}
