'use client'

import Link from 'next/link'
import { FileX, RefreshCw, Home } from 'lucide-react'

export default function InfoError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
                <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <FileX className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                <h1 className="text-xl font-semibold text-gray-900 mb-2">
                    No pudimos cargar esta página
                </h1>
                <p className="text-sm text-gray-600 mb-6">
                    Hubo un problema al cargar el contenido. Puedes intentar de nuevo o volver al inicio.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304f] transition-colors"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Recargar
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Home className="h-4 w-4" />
                        Volver al inicio
                    </Link>
                </div>

                {process.env.NODE_ENV !== 'production' && (
                    <details className="mt-5 text-left text-sm text-gray-500">
                        <summary className="cursor-pointer">Detalles técnicos</summary>
                        <pre className="mt-2 overflow-auto rounded-lg bg-gray-50 p-3 text-xs">
                            {String(error?.stack || error?.message || '')}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    )
}
