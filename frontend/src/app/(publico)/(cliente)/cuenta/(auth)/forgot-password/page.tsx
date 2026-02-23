'use client'

import { useState, useActionState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/shared/ui/forms/Button'
import { Input } from '@/shared/ui/forms/InputField'
import { Label } from '@/shared/ui/forms/Label'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/display/Card'
import { requestPasswordResetAction } from '@/features/auth/password-reset-actions'
import { toast } from '@/hook/use-toast'

function isValidationError(error: unknown): error is Record<string, { _errors: string[] }> {
    return (
        typeof error === 'object' &&
        error !== null &&
        !('message' in error && typeof error.message === 'string')
    )
}

export default function ForgotPasswordPage() {
    const [state, formAction, isPending] = useActionState(requestPasswordResetAction, {
        success: false,
        error: null,
    })

    const [email, setEmail] = useState('')

    // Mostrar toast cuando hay éxito
    if (state.success && state.message) {
        toast({
            title: 'Correo enviado',
            description: state.message,
            status: 'success',
            background: 'green-500',
            duration: 5000,
            isClosable: true,
        })
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
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <CardTitle className="text-2xl">Recuperar Contraseña</CardTitle>
                            <p className="text-gray-600 mt-2">
                                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
                            </p>
                        </CardHeader>
                        <CardContent>
                            {state.success ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Correo enviado
                                    </h3>
                                    <p className="text-gray-600 mb-6">{state.message}</p>
                                    <Link href="/cuenta/login">
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                            Volver al inicio de sesión
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <form action={formAction} className="space-y-4">
                                    <div>
                                        <Label htmlFor="email">Correo Electrónico</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                placeholder="tu@email.com"
                                                className="pl-10"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled={isPending}
                                            />
                                        </div>
                                        {isValidationError(state.error) && state.error.email && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {state.error.email._errors[0]}
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
                                                Enviando...
                                            </>
                                        ) : (
                                            <span className="text-white">Enviar enlace de recuperación</span>
                                        )}
                                    </Button>

                                    <div className="text-center">
                                        <Link
                                            href="/cuenta/login"
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            ¿Recordaste tu contraseña? Inicia sesión
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

