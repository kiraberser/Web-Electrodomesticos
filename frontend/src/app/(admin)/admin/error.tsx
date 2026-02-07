"use client";

import React from "react";
import Link from "next/link";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme";
import { Button } from "@/components/admin/ui/Button";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const { dark } = useAdminTheme();

    return (
        <div className="flex min-h-[60vh] items-center justify-center p-4 sm:p-6">
            <div
                className={`w-full max-w-xl rounded-2xl border p-6 sm:p-8 ${dark
                        ? "border-white/10 bg-[#0F172A] text-gray-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]"
                        : "border-gray-200 bg-white text-gray-900 shadow-sm"
                    }`}
                role="alert"
                aria-live="assertive"
            >
                <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-500/15">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold leading-tight sm:text-xl">Algo salió mal</h1>
                        <p className={`mt-1 text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>
                            Se produjo un error al cargar esta sección de administración. Puedes intentar de nuevo o volver al dashboard.
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-start">
                    <Button onClick={reset} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Reintentar
                    </Button>
                    <Link href="/admin/dashboard" className="sm:ml-1">
                        <Button variant="outline" className="gap-2">
                            <Home className="h-4 w-4" />
                            Ir al dashboard
                        </Button>
                    </Link>
                </div>

                {process.env.NODE_ENV !== "production" && (
                    <details className={`mt-5 text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>
                        <summary className="cursor-pointer">Detalles técnicos</summary>
                        <pre className={`mt-2 overflow-auto rounded-lg p-3 ${dark ? "bg-black/40" : "bg-gray-50"}`}>
                            {String(error?.stack || error?.message || "")}
                        </pre>
                        {error?.digest && (
                            <p className="mt-2 text-xs">Digest: {error.digest}</p>
                        )}
                    </details>
                )}
            </div>
        </div>
    );
}


