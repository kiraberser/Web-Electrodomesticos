import Link from 'next/link';

import { TabsContent } from '@/components/ui/display/Tabs';
import { Button } from '@/components/ui/forms/Button';
import { Label } from '@/components/ui/forms/Label';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/forms/InputField';

import { actionCreateUser } from '@/actions/auth';
import { toast } from '@/hook/use-toast';
import { redirect } from 'next/navigation';

const Register = ({ isSubmitting, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword }) => {

    const actionCreate = async (formData: FormData) => {
        const data = Object.fromEntries(formData);

        const { password, confirmPassword } = data;
 
        if (password !== confirmPassword) {
            toast({
                title: 'Error en las contaseñas',
                description: 'Las contraseñas no coinciden',
                status: 'error',
                background: 'red-500',
                duration: 9000,
                isClosable: true,
            })
            return;
        }
        await actionCreateUser(data)
        toast({
            title: 'Registro exitoso',
            description: 'Te has registrado correctamente',
            status: 'success',
            background: 'green-500',
            duration: 9000,
            isClosable: true,
        })
        redirect('/')
    };

    return (
        <>
            <TabsContent value="register" className="mt-6">
                <form action={actionCreate} className="space-y-4">
                    <div>
                        <Label htmlFor="register-name">Nombre Completo</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                                id="register-name"
                                type="text"
                                name='name'
                                placeholder="Juan Pérez"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="register-email">Correo Electrónico</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                                id="register-email"
                                type="email"
                                name='email'
                                placeholder="tu@email.com"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="register-phone">Teléfono</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                                id="register-phone"
                                type="tel"
                                placeholder="+52 55 1234 5678"
                                className="pl-10"
                                name='phone'
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="register-password">Contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                                id="register-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                name='password'
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

                    <div>
                        <Label htmlFor="register-confirm-password">Confirmar Contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                                name='confirmPassword'
                                id="register-confirm-password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="pl-10 pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="accept-terms"
                            name='acceptTerms'
                            className="rounded border-gray-300"
                            required
                        />
                        <Label htmlFor="accept-terms" className="text-sm text-gray-600">
                            Acepto los{' '}
                            <Link href="/terms" className="text-blue-600 hover:underline">
                                términos y condiciones
                            </Link>
                            {' '}y la{' '}
                            <Link href="/privacy" className="text-blue-600 hover:underline">
                                política de privacidad
                            </Link>
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 cursor-pointer"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Registrando...
                            </>
                        ) : (
                            <span className='text-white'>Crear Cuenta</span>
                        )}
                    </Button>
                </form>
            </TabsContent>
        </>
    )
}

export default Register