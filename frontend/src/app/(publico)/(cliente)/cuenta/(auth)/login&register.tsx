'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import Login from './login';
import Register from './register';

import { Button } from '@/shared/ui/forms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/display/Card';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/display/Tabs';
import { Separator } from '@/shared/ui/display/Separator';
import { ArrowLeft } from 'lucide-react';

const AuthPage = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sincronizar el tab activo con la URL
    useEffect(() => {
        if (pathname === '/cuenta/register' || pathname?.endsWith('/register')) {
            setActiveTab('register');
        } else if (pathname === '/cuenta/login' || pathname?.endsWith('/login')) {
            setActiveTab('login');
        } else {
            // Si está en /cuenta sin especificar, establecer login por defecto
            setActiveTab('login');
        }
    }, [pathname]);

    // Manejar cambio de tab y navegar a la ruta correspondiente
    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (value === 'login') {
            router.push('/cuenta/login');
        } else if (value === 'register') {
            router.push('/cuenta/register');
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-[#0A3981] text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                            <span>Volver al inicio</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto">
                    <Card className="shadow-lg">
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 bg-[#0A3981] rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white font-bold text-2xl">E</span>
                            </div>
                            <CardTitle className="text-2xl">Refaccionaria &apos;Vega&apos;</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs value={activeTab} onValueChange={handleTabChange}>
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="login" className='cursor-pointer '>Iniciar Sesión</TabsTrigger>
                                    <TabsTrigger value="register" className='cursor-pointer'>Registrarse</TabsTrigger>
                                </TabsList>
                                {activeTab === 'login' ? 
                                <Login 
                                    isSubmitting={isSubmitting} 
                                    setIsSubmitting={setIsSubmitting} 
                                    showPassword={showPassword} 
                                    setShowPassword={setShowPassword}/> : 
                                <Register 
                                    isSubmitting={isSubmitting} 
                                    showPassword={showPassword} 
                                    setShowPassword={setShowPassword} 
                                    showConfirmPassword={showConfirmPassword} 
                                    setShowConfirmPassword={setShowConfirmPassword} 
                                />}

                            </Tabs>
                            <div className="mt-6">
                                <Separator />
                                <p className="text-center text-sm text-gray-600 mt-4 mb-4">
                                    O continúa con
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        variant="outline"
                                        //onClick={() => handleSocialLogin('Google')}
                                        className="w-full"
                                    >
                                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Google
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                        Facebook
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;