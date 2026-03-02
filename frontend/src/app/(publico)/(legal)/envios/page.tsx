import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Política de Envíos — Refaccionaria Vega',
    description: 'Conoce los tiempos de entrega, costos de envío y cobertura de Refaccionaria Vega. Enviamos a toda la República Mexicana.',
    alternates: {
        canonical: 'https://www.refaccionariavega.com.mx/envios',
    },
}

export default function EnviosPage() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <div className="bg-[#0A3981] text-white py-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Política de Envíos</h1>
                    <p className="text-blue-200">Enviamos refacciones a toda la República Mexicana</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        Cobertura
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Realizamos envíos a <strong>todos los estados de la República Mexicana</strong>. Las zonas metropolitanas y ciudades con mayor infraestructura logística pueden recibir sus pedidos antes. En zonas rurales o de difícil acceso los tiempos pueden extenderse hasta 2 días adicionales.
                    </p>
                    <p className="text-gray-700 mt-3">
                        <strong>No realizamos envíos internacionales.</strong>
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        Tiempos de Entrega
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-700">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left px-4 py-3 font-semibold rounded-tl-lg">Zona</th>
                                    <th className="text-left px-4 py-3 font-semibold rounded-tr-lg">Tiempo estimado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="px-4 py-3">Martínez de la Torre y zona conurbada</td>
                                    <td className="px-4 py-3">1 – 2 días hábiles</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3">Veracruz (estado)</td>
                                    <td className="px-4 py-3">2 – 3 días hábiles</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3">Centro del país (CDMX, Puebla, Hidalgo)</td>
                                    <td className="px-4 py-3">3 – 5 días hábiles</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3">Norte y Occidente del país</td>
                                    <td className="px-4 py-3">4 – 7 días hábiles</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3">Zonas de difícil acceso</td>
                                    <td className="px-4 py-3">Hasta 10 días hábiles</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                        Los tiempos son estimados y pueden variar según disponibilidad de la paquetería y condiciones externas. Los días hábiles no incluyen sábados, domingos ni días festivos.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        Costo de Envío
                    </h2>
                    <div className="flex items-start gap-4 mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-2xl">🎉</span>
                        <div>
                            <p className="font-semibold text-green-800">Envío gratis en pedidos mayores a $800 MXN</p>
                            <p className="text-sm text-green-700 mt-1">
                                En pedidos iguales o superiores a $800 pesos el envío es sin costo, sin importar la zona de destino.
                            </p>
                        </div>
                    </div>
                    <p className="text-gray-700">
                        Para pedidos menores a $800 MXN, el costo de envío se calcula automáticamente según el peso total del paquete y la zona de entrega. Lo verás desglosado antes de confirmar tu compra.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        Embalaje
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Empacamos cada pieza con material protector adecuado para evitar daños en tránsito. Las piezas frágiles o de mayor tamaño reciben embalaje reforzado. Si recibes un paquete con signos visibles de daño, <strong>no lo firmes</strong> y contáctanos de inmediato.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        Seguimiento de Pedido
                    </h2>
                    <p className="text-gray-700 mb-3">
                        Una vez que tu pedido sea recolectado por la paquetería, recibirás un correo electrónico con:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Número de guía</li>
                        <li>Nombre de la paquetería</li>
                        <li>Enlace directo para rastrear tu envío</li>
                    </ul>
                    <p className="text-gray-700 mt-3">
                        También puedes consultar el estado de tu pedido en la sección{' '}
                        <a href="/cuenta/perfil/pedidos" className="text-[#0A3981] underline">Mis Pedidos</a>{' '}
                        de tu cuenta.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        Paquetería
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Trabajamos principalmente con <strong>Estafeta</strong> y <strong>Paquetexpress</strong>, seleccionando la mejor opción según la zona de destino y el tipo de paquete. No es posible seleccionar una paquetería específica al realizar el pedido.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        ¿Tienes alguna duda?
                    </h2>
                    <p className="text-gray-700">
                        Escríbenos a{' '}
                        <a href="mailto:contacto@refaccionariavega.com.mx" className="text-[#0A3981] underline">
                            contacto@refaccionariavega.com.mx
                        </a>{' '}
                        o llámanos al <strong>(232) 324-0000</strong>.
                    </p>
                </div>

                <p className="text-xs text-gray-400 text-center mt-4">
                    Última actualización: marzo 2026
                </p>
            </div>
        </div>
    )
}
