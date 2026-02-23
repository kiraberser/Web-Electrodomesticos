'use client'

import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function PublicError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-gray-900">
                <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold text-navy-900">Algo salió mal</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Ocurrió un error inesperado. Puedes intentar recargar la página o volver al inicio.
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
                    <details className="mt-5 text-sm text-gray-500">
                        <summary className="cursor-pointer">Detalles técnicos</summary>
                        <pre className="mt-2 overflow-auto rounded-lg bg-gray-50 p-3 text-xs">
                            {String(error?.stack || error?.message || '')}
                        </pre>
                        {error?.digest && (
                            <p className="mt-2 text-xs">Digest: {error.digest}</p>
                        )}
                    </details>
                )}
            </div>
        </div>
    )
}
