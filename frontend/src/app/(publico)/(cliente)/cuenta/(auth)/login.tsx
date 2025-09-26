import { TabsContent, } from '@/components/ui/display/Tabs';
import { Label } from '@/components/ui/forms/Label';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/forms/InputField';

import Link from 'next/link';
import { Button } from '@/components/ui/forms/Button';

import { actionLoginUser } from '@/actions/auth';
import { toast } from '@/hook/use-toast';
import { redirect } from 'next/navigation';


function Login({ isSubmitting, setIsSubmitting, showPassword, setShowPassword }) {
    const actionLogin = async (formData: FormData) => {
        const FormData = Object.fromEntries(formData);

        if (!FormData) {
            toast({
                title: 'Error de validación',
                description: 'Por favor, completa todos los campos',
                status: 'error',
                background: 'red-500',
                duration: 9000,
                isClosable: true,
            })
            return;
        }
        await actionLoginUser(FormData)
        toast({
            title: 'Inicio de sesión exitoso',
            description: 'Te has logueado correctamente',
            status: 'success',
            background: 'green-500',
            duration: 9000,
            isClosable: true,
        })
        redirect('/')
    }

    return (
        <>
            <TabsContent value="login" className="mt-6">
                <form action={actionLogin} className="space-y-4">
                    <div>
                        <Label htmlFor="login-email">Correo Electrónico</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                                id="login-email"
                                type="email"
                                name='email'
                                placeholder="tu@email.com"
                                className="pl-10"
                                required
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
                                name='password'
                                placeholder="••••••••"
                                className="pl-10 pr-10"
                                required
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
                            <input
                                type="checkbox"
                                className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-600">Recordarme</span>
                        </label>
                        <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Iniciando...
                            </>
                        ) : (
                            <span className='text-white'>Iniciar Sesión</span>
                        )}
                    </Button>
                </form>
            </TabsContent>
        </>
    )
}

export default Login