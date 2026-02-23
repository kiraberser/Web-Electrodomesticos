// @ts-nocheck - React 19 useActionState typing issue
"use client"

import type React from "react"
import { useState, useActionState, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"
import { X, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/shared/ui/forms/Button"
import { Input } from "@/shared/ui/forms/InputField"
import { Label } from "@/shared/ui/forms/Label"
import { changePasswordAction, type PasswordResetActionState } from "@/features/auth/password-reset-actions"
import PasswordStrengthIndicator from "@/features/auth/PasswordStrengthIndicator"
import { useRouter } from "next/navigation"

interface ChangePasswordModalProps {
    isOpen: boolean
    onClose: () => void
}

// Type guard para verificar si el error es un objeto de validación
function isValidationError(error: unknown): error is Record<string, { _errors: string[] }> {
    return (
        error !== null &&
        typeof error === 'object' &&
        !Array.isArray(error) &&
        Object.values(error).every(
            (value) =>
                typeof value === 'object' &&
                value !== null &&
                '_errors' in value &&
                Array.isArray(value._errors)
        )
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()
    
    return (
        <Button
            type="submit"
            disabled={pending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
        >
            {pending ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Cambiando...
                </>
            ) : (
                "Cambiar Contraseña"
            )}
        </Button>
    )
}

export function ChangePasswordModal({
    isOpen,
    onClose,
}: ChangePasswordModalProps) {
    const router = useRouter()
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [newPassword, setNewPassword] = useState('')

    const initialState: PasswordResetActionState = { success: false, error: null }
    const [state, formAction, isPending] = useActionState<PasswordResetActionState, FormData>(
        changePasswordAction,
        initialState
    )

    // Reset form cuando se cierra el modal
    useEffect(() => {
        if (!isOpen) {
            setNewPassword('')
        }
    }, [isOpen])

    // Manejar éxito - redirigir al login después de cambiar contraseña
    const hasHandledSuccess = useRef(false)
    
    useEffect(() => {
        if (state.success && !hasHandledSuccess.current) {
            hasHandledSuccess.current = true
            
            // Cerrar modal después de un breve delay
            setTimeout(() => {
                onClose()
                // Redirigir al login porque se invalidaron las sesiones
                router.push('/cuenta/login')
            }, 2000)
        }
        
        // Reset flag cuando el modal se cierra
        if (!isOpen) {
            hasHandledSuccess.current = false
        }
    }, [state.success, onClose, isOpen, router])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Lock className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#0A3981]">Cambiar Contraseña</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        disabled={state.success || isPending}
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <form action={formAction} className="flex-1 overflow-y-auto p-6">
                    {/* Success Message */}
                    {state.success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>{state.message || 'Contraseña cambiada exitosamente'}</span>
                        </div>
                    )}

                    {/* General Error */}
                    {state.error && typeof state.error === 'string' && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
                            <AlertCircle className="w-5 h-5" />
                            <span>{state.error}</span>
                        </div>
                    )}

                    {/* Current Password */}
                    <div className="mb-4">
                        <Label htmlFor="current_password" className="text-sm font-medium text-gray-700">
                            Contraseña Actual *
                        </Label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                                id="current_password"
                                name="current_password"
                                type={showCurrentPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="pl-10 pr-10"
                                required
                                disabled={state.success || isPending}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                disabled={state.success || isPending}
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {isValidationError(state.error) && state.error.current_password?._errors?.length > 0 && (
                            <p className="mt-1 text-sm text-red-600">{state.error.current_password._errors[0]}</p>
                        )}
                    </div>

                    {/* New Password */}
                    <div className="mb-4">
                        <Label htmlFor="new_password" className="text-sm font-medium text-gray-700">
                            Nueva Contraseña *
                        </Label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                                id="new_password"
                                name="new_password"
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="pl-10 pr-10"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={state.success || isPending}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                disabled={state.success || isPending}
                            >
                                {showNewPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {newPassword && (
                            <div className="mt-2">
                                <PasswordStrengthIndicator password={newPassword} />
                            </div>
                        )}
                        {isValidationError(state.error) && state.error.new_password?._errors?.length > 0 && (
                            <p className="mt-1 text-sm text-red-600">{state.error.new_password._errors[0]}</p>
                        )}
                    </div>

                    {/* Confirm New Password */}
                    <div className="mb-6">
                        <Label htmlFor="new_password_confirm" className="text-sm font-medium text-gray-700">
                            Confirmar Nueva Contraseña *
                        </Label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                                id="new_password_confirm"
                                name="new_password_confirm"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="pl-10 pr-10"
                                required
                                disabled={state.success || isPending}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                disabled={state.success || isPending}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {isValidationError(state.error) && state.error.new_password_confirm?._errors?.length > 0 && (
                            <p className="mt-1 text-sm text-red-600">{state.error.new_password_confirm._errors[0]}</p>
                        )}
                    </div>

                    {/* Info Message */}
                    {state.success && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                            <p>Tu sesión será cerrada por seguridad. Serás redirigido al inicio de sesión.</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={state.success || isPending}
                        >
                            Cancelar
                        </Button>
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    )
}

