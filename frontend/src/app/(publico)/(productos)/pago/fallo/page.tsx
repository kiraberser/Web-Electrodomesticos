'use client'

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/forms/Button';
import Link from 'next/link';

export default function PagoFalloPage() {
    const searchParams = useSearchParams();
    const pedidoId = searchParams.get('pedido_id');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Pago Rechazado
                    </h1>
                    <p className="text-gray-600 mb-6">
                        No se pudo procesar tu pago. Por favor, verifica tus datos e intenta de nuevo.
                    </p>
                    {pedidoId && (
                        <p className="text-sm text-gray-500 mb-6">
                            Número de pedido: <span className="font-semibold">#{pedidoId}</span>
                        </p>
                    )}
                    <div className="space-y-3">
                        <Link href="/">
                            <Button className="w-full bg-orange-500 hover:bg-orange-600">
                                Volver al inicio
                            </Button>
                        </Link>
                        <Link href="/carrito">
                            <Button variant="outline" className="w-full">
                                Intentar de nuevo
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

