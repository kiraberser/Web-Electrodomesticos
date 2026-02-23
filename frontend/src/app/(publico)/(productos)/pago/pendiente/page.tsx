'use client'

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Clock } from 'lucide-react';
import { Button } from '@/shared/ui/forms/Button';
import Link from 'next/link';

export default function PagoPendientePage() {
    const searchParams = useSearchParams();
    const pedidoId = searchParams.get('pedido_id');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <Clock className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Pago Pendiente
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Tu pago está siendo procesado. Te notificaremos cuando se complete.
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
                        <Link href="/mis-pedidos">
                            <Button variant="outline" className="w-full">
                                Ver mis pedidos
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

