'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/forms/Button';
import Link from 'next/link';

export default function PagoExitoPage() {
    const searchParams = useSearchParams();
    const pedidoId = searchParams.get('pedido_id');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verificarPago = async () => {
            if (!pedidoId) {
                setLoading(false);
                return;
            }

            try {
                // Aquí podrías consultar el estado del pago si tienes el pago_id
                // Por ahora solo mostramos el mensaje de éxito
                setLoading(false);
            } catch (error) {
                console.error('Error al verificar pago:', error);
                setLoading(false);
            }
        };

        verificarPago();
    }, [pedidoId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        ¡Pago Exitoso!
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación pronto.
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

