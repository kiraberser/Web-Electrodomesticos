'use client'

import { X, Heart, LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/forms/Button'

interface AuthRequiredModalProps {
    isOpen: boolean
    onCloseAction: () => void
}

export default function AuthRequiredModal({ isOpen, onCloseAction }: AuthRequiredModalProps) {
    const router = useRouter()

    if (!isOpen) return null

    const handleGoToLogin = () => {
        onCloseAction()
        router.push('/cuenta')
    }

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div 
                    className="fixed inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-sm transition-opacity z-[9998]" 
                    onClick={onCloseAction}
                />

                {/* Modal */}
                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all z-[9999]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-[#0A3981]/10 rounded-full flex items-center justify-center">
                                <Heart className="w-5 h-5 text-[#0A3981]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Inicia sesión para continuar
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Necesitas una cuenta para agregar favoritos
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onCloseAction}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="text-center mb-6">
                            <div className="mx-auto w-16 h-16 bg-[#FFF8F3] rounded-full flex items-center justify-center mb-4">
                                <Heart className="w-8 h-8 text-[#E38E49]" />
                            </div>
                            <p className="text-gray-700 mb-2">
                                Para agregar productos a tus favoritos, necesitas iniciar sesión en tu cuenta.
                            </p>
                            <p className="text-sm text-gray-500">
                                Así podrás guardar tus productos favoritos y acceder a ellos fácilmente.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="ghost"
                                onClick={onCloseAction}
                                className="flex-1 border border-gray-300 hover:bg-gray-50"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleGoToLogin}
                                className="flex-1 bg-[#0A3981] hover:bg-[#1F509A] text-white flex items-center justify-center gap-2"
                            >
                                <LogIn className="w-4 h-4" />
                                Iniciar sesión
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

