'use client'

import { useState, useEffect, useActionState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/ui/forms/Button'
import { Input } from '@/shared/ui/forms/InputField'
import { Label } from '@/shared/ui/forms/Label'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/display/Card'
import { confirmPasswordResetAction, validatePasswordResetTokenAction } from '@/features/auth/password-reset-actions'
import PasswordStrengthIndicator from '@/features/auth/PasswordStrengthIndicator'
import { toast } from '@/hook/use-toast'

function isValidationError(error: unknown): error is Record<string, { _errors: string[] }> {
    return (
        typeof error === 'object' &&
        error !== null &&
        !('message' in error && typeof error.message === 'string')
    )
}

export default function ResetPasswordPage() {
    const params = useParams()
    const router = useRouter()
    const uid = params.uid as string
    const token = params.token as string
    const [isValidating, setIsValidating] = useState(true)
    const [isValid, setIsValid] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [password, setPassword] = useState('')

    const [state, formAction, isPending] = useActionState(confirmPasswordResetAction, {
        success: false,
        error: null,
    })

    // Validar token al cargar
    useEffect(() => {
        async function validateToken() {
            if (!token || !uid) {
                setIsValidating(false)
                setIsValid(false)
                return
            }

            try {
                const result = await validatePasswordResetTokenAction(token, uid)
                setIsValid(result.success)
            } catch (error) {
                setIsValid(false)
            } finally {
                setIsValidating(false)
            }
        }

        validateToken()
    }, [token, uid])

    // Mostrar toast cuando hay éxito
    useEffect(() => {
        if (state.success && state.message) {
            toast({
                title: 'Contraseña restablecida',
                description: state.message,
                status: 'success',
                background: 'green-500',
                duration: 5000,
                isClosable: true,
            })
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                router.push('/cuenta/login')
            }, 2000)
        }
    }, [state.success, state.message, router])

    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Validando token...</p>
                </div>
            </div>
        )
    }

    if (!isValid) {
        return (
            <div className="min-h-screen">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/cuenta/login"
                                className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Volver al inicio de sesión</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-md mx-auto">
                        <Card className="shadow-lg">
                            <CardContent className="py-12 text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Token inválido o expirado
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    El enlace de recuperación no es válido o ha expirado. Por favor solicita uno nuevo.
                                </p>
                                <Link href="/cuenta/forgot-password">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                        Solicitar nuevo enlace
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/cuenta/login"
                            className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Volver al inicio de sesión</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto">
                    <Card className="shadow-lg">
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle className="text-2xl">Restablecer Contraseña</CardTitle>
                            <p className="text-gray-600 mt-2">
                                Ingresa tu nueva contraseña. Asegúrate de que sea segura.
                            </p>
                        </CardHeader>
                        <CardContent>
                            {state.success ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Contraseña restablecida
                                    </h3>
                                    <p className="text-gray-600 mb-6">{state.message}</p>
                                    <p className="text-sm text-gray-500">Redirigiendo al inicio de sesión...</p>
                                </div>
                            ) : (
                                <form action={formAction} className="space-y-4">
                                    <input type="hidden" name="token" value={token} />
                                    <input type="hidden" name="uid" value={uid} />

                                    <div>
                                        <Label htmlFor="password">Nueva Contraseña</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                placeholder="••••••••"
                                                className="pl-10 pr-10"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                disabled={isPending}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                                disabled={isPending}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                        {password && (
                                            <div className="mt-2">
                                                <PasswordStrengthIndicator password={password} />
                                            </div>
                                        )}
                                        {isValidationError(state.error) && state.error.password && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {state.error.password._errors[0]}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="password_confirm">Confirmar Contraseña</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="password_confirm"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="password_confirm"
                                                placeholder="••••••••"
                                                className="pl-10 pr-10"
                                                required
                                                disabled={isPending}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                                disabled={isPending}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                        {isValidationError(state.error) && state.error.password_confirm && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {state.error.password_confirm._errors[0]}
                                            </p>
                                        )}
                                        {typeof state.error === 'string' && (
                                            <p className="text-sm text-red-600 mt-1">{state.error}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                        disabled={isPending}
                                    >
                                        {isPending ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Restableciendo...
                                            </>
                                        ) : (
                                            <span className="text-white">Restablecer Contraseña</span>
                                        )}
                                    </Button>

                                    <div className="text-center">
                                        <Link
                                            href="/cuenta/login"
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            Volver al inicio de sesión
                                        </Link>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

