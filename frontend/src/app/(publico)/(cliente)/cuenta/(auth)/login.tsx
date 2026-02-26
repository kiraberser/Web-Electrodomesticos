'use client'

import { useState } from 'react'
import { TabsContent } from '@/shared/ui/display/Tabs'
import { Label } from '@/shared/ui/forms/Label'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { Input } from '@/shared/ui/forms/InputField'
import Link from 'next/link'
import { Button } from '@/shared/ui/forms/Button'
import { actionLoginUser } from '@/features/auth/actions'
import { toast } from '@/hook/use-toast'
import { redirect } from 'next/navigation'

interface LoginProps {
    isSubmitting: boolean
    setIsSubmitting: (value: boolean) => void
    showPassword: boolean
    setShowPassword: (value: boolean) => void
}

function Login({ isSubmitting, setIsSubmitting, showPassword, setShowPassword }: LoginProps) {
    const [error, setError] = useState<string | null>(null)

    const actionLogin = async (formData: FormData) => {
        const formDataObj = Object.fromEntries(formData) as { email?: string; password?: string }

        if (!formDataObj.email || !formDataObj.password) {
            setError('Por favor, completa todos los campos')
            return
        }

        setError(null)
        setIsSubmitting(true)

        try {
            const result = await actionLoginUser({ email: formDataObj.email, password: formDataObj.password })

            if (!result.success) {
                setError(typeof result.error === 'string' ? result.error : 'Correo o contraseña incorrectos')
                return
            }

            toast({
                title: 'Inicio de sesión exitoso',
                description: 'Bienvenido de nuevo',
                status: 'success',
                background: 'green-500',
                duration: 4000,
                isClosable: true,
            })
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('cart-auth-changed'))
            }
            redirect('/')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <TabsContent value="login" className="mt-6">
                <form action={actionLogin} className="space-y-4">

                    {/* Error banner inline */}
                    {error && (
                        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <Label htmlFor="login-email">Correo Electrónico</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                                id="login-email"
                                type="email"
                                name="email"
                                placeholder="tu@email.com"
                                className="pl-10"
                                required
                                onChange={() => setError(null)}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="login-password">Contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="••••••••"
                                className="pl-10 pr-10"
                                required
                                onChange={() => setError(null)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded border-gray-300" />
                            <span className="text-sm text-gray-600">Recordarme</span>
                        </label>
                        <Link href="/cuenta/forgot-password" className="text-sm text-blue-600 hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#0A3981] cursor-pointer"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Iniciando...
                            </>
                        ) : (
                            <span className="text-white">Iniciar Sesión</span>
                        )}
                    </Button>
                </form>
            </TabsContent>
        </>
    )
}

export default Login
