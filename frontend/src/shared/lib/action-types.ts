import { ZodError } from 'zod'

export type ActionState<T = unknown> = {
    success: boolean
    error: string | null | Record<string, { _errors: string[] }> | unknown
    data?: T
}

export function formatZodErrors(error: ZodError): Record<string, { _errors: string[] }> {
    const formattedErrors: Record<string, { _errors: string[] }> = {}
    error.errors.forEach((err) => {
        const path = err.path.join('.')
        if (!formattedErrors[path]) {
            formattedErrors[path] = { _errors: [] }
        }
        formattedErrors[path]._errors.push(err.message)
    })
    return formattedErrors
}

export function getErrorMessage(error: unknown, defaultMessage: string): string {
    if (error && typeof error === 'object') {
        // Check for axios error response
        if ('response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
            const data = (error.response as { data: unknown }).data
            // Handle validation errors
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                const fieldErrors = Object.keys(data as Record<string, unknown>).map(key => {
                    const value = (data as Record<string, unknown>)[key]
                    if (Array.isArray(value)) {
                        return `${key}: ${value[0]}`
                    }
                    return `${key}: ${String(value)}`
                })
                if (fieldErrors.length > 0) {
                    return fieldErrors.join(', ')
                }
            }
            return String(data)
        }
        // Check for error message
        if ('message' in error && typeof (error as { message: unknown }).message === 'string') {
            return (error as { message: string }).message
        }
    }
    return defaultMessage
}
