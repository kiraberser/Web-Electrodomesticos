'use server'

import { requestPasswordReset, validatePasswordResetToken, confirmPasswordReset, changePassword } from '@/api/user'
import type { PasswordResetRequestInput, PasswordResetConfirmInput, ChangePasswordInput } from '@/lib/validations/password'
import { passwordResetRequestSchema, passwordResetConfirmSchema, changePasswordSchema } from '@/lib/validations/password'

export type PasswordResetActionState = {
    success: boolean
    error: string | null | Record<string, { _errors: string[] }>
    message?: string
}

// Helper function to safely extract error message
function getErrorMessage(error: unknown, defaultMessage: string): string {
    if (error && typeof error === 'object') {
        // Check for axios error response
        if ('response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
            const data = error.response.data
            // Handle validation errors
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                // Check for field-specific errors
                const fieldErrors = Object.keys(data).map(key => {
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
            // Check for detail field (common in DRF)
            if ('detail' in data && typeof data.detail === 'string') {
                return data.detail
            }
            return String(data)
        }
        // Check for error message
        if ('message' in error && typeof error.message === 'string') {
            return error.message
        }
    }
    return defaultMessage
}

/**
 * Server Action para solicitar recuperación de contraseña
 */
export async function requestPasswordResetAction(
    prevState: PasswordResetActionState,
    formData: FormData
): Promise<PasswordResetActionState> {
    try {
        const email = (formData.get('email') as string)?.trim() || ''

        // Validar con Zod
        const validationResult = passwordResetRequestSchema.safeParse({ email })

        if (!validationResult.success) {
            const fieldErrors: Record<string, { _errors: string[] }> = {}
            validationResult.error.errors.forEach((err) => {
                const field = err.path[0] as string
                if (!fieldErrors[field]) {
                    fieldErrors[field] = { _errors: [] }
                }
                fieldErrors[field]._errors.push(err.message)
            })

            return {
                success: false,
                error: fieldErrors,
            }
        }

        // Llamar a la API
        const result = await requestPasswordReset({
            email: validationResult.data.email,
        })

        return {
            success: true,
            error: null,
            message: result.message || 'Si el correo existe, recibirás un enlace para restablecer tu contraseña',
        }
    } catch (error: unknown) {
        console.error('Error en requestPasswordResetAction:', error)
        return {
            success: false,
            error: getErrorMessage(error, 'Error al solicitar recuperación de contraseña'),
        }
    }
}

/**
 * Server Action para validar un token de recuperación
 */
export async function validatePasswordResetTokenAction(
    token: string,
    uid: string
): Promise<PasswordResetActionState> {
    try {
        if (!token || !uid) {
            return {
                success: false,
                error: 'Token y UID son requeridos',
            }
        }

        const result = await validatePasswordResetToken({ token, uid })

        return {
            success: true,
            error: null,
            message: result.message || 'Token válido',
        }
    } catch (error: unknown) {
        console.error('Error en validatePasswordResetTokenAction:', error)
        return {
            success: false,
            error: getErrorMessage(error, 'Token inválido o expirado'),
        }
    }
}

/**
 * Server Action para confirmar y cambiar la contraseña
 */
export async function confirmPasswordResetAction(
    prevState: PasswordResetActionState,
    formData: FormData
): Promise<PasswordResetActionState> {
    try {
        const token = (formData.get('token') as string)?.trim() || ''
        const uid = (formData.get('uid') as string)?.trim() || ''
        const password = (formData.get('password') as string) || ''
        const password_confirm = (formData.get('password_confirm') as string) || ''

        // Validar con Zod
        const validationResult = passwordResetConfirmSchema.safeParse({
            token,
            uid,
            password,
            password_confirm,
        })

        if (!validationResult.success) {
            const fieldErrors: Record<string, { _errors: string[] }> = {}
            validationResult.error.errors.forEach((err) => {
                const field = err.path[0] as string
                if (!fieldErrors[field]) {
                    fieldErrors[field] = { _errors: [] }
                }
                fieldErrors[field]._errors.push(err.message)
            })

            return {
                success: false,
                error: fieldErrors,
            }
        }

        // Llamar a la API
        const result = await confirmPasswordReset({
            token: validationResult.data.token,
            uid: validationResult.data.uid,
            password: validationResult.data.password,
            password_confirm: validationResult.data.password_confirm,
        })

        return {
            success: true,
            error: null,
            message: result.message || 'Contraseña restablecida exitosamente',
        }
    } catch (error: unknown) {
        console.error('Error en confirmPasswordResetAction:', error)
        return {
            success: false,
            error: getErrorMessage(error, 'Error al restablecer la contraseña'),
        }
    }
}

/**
 * Server Action para cambiar contraseña desde el perfil
 */
export async function changePasswordAction(
    prevState: PasswordResetActionState,
    formData: FormData
): Promise<PasswordResetActionState> {
    try {
        const current_password = (formData.get('current_password') as string) || ''
        const new_password = (formData.get('new_password') as string) || ''
        const new_password_confirm = (formData.get('new_password_confirm') as string) || ''

        // Validar con Zod
        const validationResult = changePasswordSchema.safeParse({
            current_password,
            new_password,
            new_password_confirm,
        })

        if (!validationResult.success) {
            const fieldErrors: Record<string, { _errors: string[] }> = {}
            validationResult.error.errors.forEach((err) => {
                const field = err.path[0] as string
                if (!fieldErrors[field]) {
                    fieldErrors[field] = { _errors: [] }
                }
                fieldErrors[field]._errors.push(err.message)
            })

            return {
                success: false,
                error: fieldErrors,
            }
        }

        // Llamar a la API
        const result = await changePassword({
            current_password: validationResult.data.current_password,
            new_password: validationResult.data.new_password,
            new_password_confirm: validationResult.data.new_password_confirm,
        })

        return {
            success: true,
            error: null,
            message: result.message || 'Contraseña cambiada exitosamente',
        }
    } catch (error: unknown) {
        console.error('Error en changePasswordAction:', error)
        return {
            success: false,
            error: getErrorMessage(error, 'Error al cambiar la contraseña'),
        }
    }
}

