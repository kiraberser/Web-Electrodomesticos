"use client"

import { useEffect } from "react"
import { Button } from "@/components/admin/ui"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Error en página de productos:', error)
    }, [error])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                    Algo salió mal
                </h2>
                
                <p className="mb-6 text-gray-600">
                    Ha ocurrido un error al cargar la página de productos. 
                    Por favor, intenta nuevamente.
                </p>

                {error.message && (
                    <div className="mb-6 rounded-lg bg-red-50 p-3 text-left">
                        <p className="text-sm font-mono text-red-800">
                            {error.message}
                        </p>
                    </div>
                )}

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                    <Button
                        onClick={reset}
                        variant="primary"
                        className="cursor-pointer"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reintentar
                    </Button>
                    
                    <Button
                        onClick={() => window.location.href = '/admin'}
                        variant="outline"
                        className="cursor-pointer"
                    >
                        Volver al inicio
                    </Button>
                </div>
            </div>
        </div>
    )
}

