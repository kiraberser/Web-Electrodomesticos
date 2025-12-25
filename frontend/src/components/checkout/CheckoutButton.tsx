'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { crearPreferenciaPago } from '@/api/pagos'; 
import { crearPedido } from '@/api/pedidos'; // Asegúrate de importar esto
import toast from 'react-hot-toast';
import { getToken } from '@/lib/utilscookies';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { Button } from '../ui/forms/Button';
import { CreditCard, Loader2 } from 'lucide-react';

interface CheckoutButtonProps {
    className?: string;
    buttonLabel?: string; 
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ className, buttonLabel = 'Pagar ahora' }) => {
    const router = useRouter();
    const { items } = useCart(); 
    const [loading, setLoading] = useState(false);
    const [preferenciaId, setPreferenciaId] = useState<string | null>(null);
    
    // No necesitamos state para pedidoId aquí, lo usaremos como variable local 
    // para evitar problemas de asincronía.

    useEffect(() => {
        initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || '', {
            locale: 'es-MX'
        });
    }, []);

    const handleTransaction = async () => {
        // --- VALIDACIONES INICIALES ---
        if (items.length === 0) {
            toast.error('Tu carrito está vacío');
            return;
        }

        const token = await getToken();
        if (!token) {
            toast.error('Inicia sesión para continuar');
            router.push('/login');
            return;
        }

        setLoading(true);

        try {
            // --- PASO 1: CREAR PEDIDO EN DJANGO (Backend) ---
            // Mapeamos los items para tu API de pedidos (solo IDs y cantidades)
            const itemsParaPedido = items.map(item => ({
                refaccion: Number(item.id), // Convertir string a number
                cantidad: item.quantity,
            }));

            // Esperamos a que se cree el pedido y recibimos la respuesta
            const respuestaPedido = await crearPedido(itemsParaPedido);
            const nuevoPedidoId = respuestaPedido.pedido_id;
            
            
            if (!respuestaPedido || !respuestaPedido.pedido_id) {
                throw new Error('Error al crear el pedido en el servidor');
            }

            // Construir items para la preferencia de pago
            const itemsParaPreferencia = items.map(item => ({
                title: item.name,
                quantity: item.quantity,
                unit_price: item.price,
            }));

            const datosPreferencia = {
                pedido_id: nuevoPedidoId,
                items: itemsParaPreferencia,
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/pago/exito`,
                    failure: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/pago/fallo`,
                    pending: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/pago/pendiente`,
                },
            };

            const respuestaMP = await crearPreferenciaPago(datosPreferencia);
            
            if (respuestaMP && respuestaMP.preference_id) {
                setPreferenciaId(respuestaMP.preference_id);
                // Aquí ya NO redirigimos ni hacemos nada más.
                // El renderizado condicional abajo mostrará el componente Wallet.
            } else {
                throw new Error('Mercado Pago no devolvió un ID de preferencia');
            }

        } catch (error: any) {
            console.error('Error en el proceso de checkout:', error);
            const msg = error.response?.data?.message || error.message || 'Error al procesar la solicitud.';
            toast.error(msg);
            setPreferenciaId(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`w-full ${className}`}>
            {!preferenciaId ? (
                // ESTADO 1: Botón para iniciar el proceso
                <Button 
                    onClick={handleTransaction} 
                    disabled={loading || items.length === 0}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 transition-all duration-300 hover:scale-[1.02] w-full shadow-md font-semibold text-lg"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin mr-2 h-5 w-5" />
                            Procesando pedido...
                        </>
                    ) : (
                        <>
                            <CreditCard className="mr-2 h-5 w-5" />
                            {buttonLabel}
                        </>
                    )}
                </Button>   
            ) : (
                // ESTADO 2: Wallet de Mercado Pago (aparece tras crear el pedido)
                <div className="animate-in fade-in zoom-in duration-300 w-full">
                    <div className="mb-2 text-center text-sm text-green-600 font-medium">
                        ¡Pedido creado! Completa tu pago abajo:
                    </div>
                    <Wallet 
                        initialization={{ preferenceId: preferenciaId, redirectMode: 'blank' }}
                    />
                    <button 
                        onClick={() => setPreferenciaId(null)}
                        className="text-xs text-gray-400 underline w-full text-center mt-3 hover:text-gray-600"
                    >
                        Cancelar y volver
                    </button>
                </div>
            )}
        </div>
    );
};

export default CheckoutButton;