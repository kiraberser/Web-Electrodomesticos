import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Términos y Condiciones — Refaccionaria Vega',
    description: 'Lee los términos y condiciones de uso del sitio web y tienda en línea de Refaccionaria Vega.',
    alternates: {
        canonical: 'https://www.refaccionariavega.com.mx/terms-conditions',
    },
}

export default function TermsConditionsPage() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <div className="bg-[#0A3981] text-white py-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Términos y Condiciones</h1>
                    <p className="text-blue-200">Condiciones de uso del sitio web y servicio de venta en línea</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        1. Aceptación de los Términos
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Al acceder y utilizar el sitio web de Refaccionaria Vega (
                        <strong>www.refaccionariavega.com.mx</strong>), usted acepta quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguno de ellos, le rogamos que no utilice nuestro sitio ni realice compras a través de él.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        2. Proceso de Compra
                    </h2>
                    <p className="text-gray-700 mb-3">El proceso de compra en línea consta de los siguientes pasos:</p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>Seleccione los productos y agréguelos al carrito.</li>
                        <li>Inicie sesión o cree una cuenta con sus datos.</li>
                        <li>Ingrese o confirme su dirección de entrega.</li>
                        <li>Elija el método de pago y confirme el pedido.</li>
                        <li>Recibirá una confirmación por correo electrónico con el número de pedido.</li>
                    </ol>
                    <p className="text-gray-700 mt-3">
                        El contrato de compraventa se perfecciona en el momento en que confirmamos la recepción de su pedido y el pago ha sido verificado.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        3. Precios y Pagos
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Todos los precios están expresados en <strong>pesos mexicanos (MXN)</strong> e incluyen IVA cuando aplica.</li>
                        <li>Nos reservamos el derecho de modificar los precios sin previo aviso. El precio aplicable es el vigente al momento de confirmar el pedido.</li>
                        <li>Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express) y pagos en efectivo a través de MercadoPago.</li>
                        <li>En caso de error en el precio, le notificaremos antes de procesar el pedido y podrá aceptar el precio correcto o cancelar la orden.</li>
                    </ul>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        4. Envíos y Entregas
                    </h2>
                    <p className="text-gray-700 mb-3">
                        Los envíos se realizan a toda la República Mexicana a través de empresas de paquetería certificadas. Los tiempos de entrega son estimados y pueden variar según la zona y la disponibilidad del transportista. Para más detalles, consulte nuestra{' '}
                        <a href="/envios" className="text-[#0A3981] underline">Política de Envíos</a>.
                    </p>
                    <p className="text-gray-700">
                        El riesgo de pérdida o daño del producto se transfiere al cliente una vez entregado al transportista. Si el paquete llega dañado, contáctenos en las primeras 24 horas.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        5. Devoluciones y Cancelaciones
                    </h2>
                    <p className="text-gray-700 mb-3">
                        Aceptamos devoluciones dentro de los <strong>30 días naturales</strong> siguientes a la entrega, siempre que la pieza cumpla con las condiciones establecidas en nuestra{' '}
                        <a href="/devoluciones" className="text-[#0A3981] underline">Política de Devoluciones</a>.
                    </p>
                    <p className="text-gray-700">
                        Las cancelaciones solo proceden mientras el pedido no haya sido enviado. Contacte a soporte lo antes posible para solicitarla.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        6. Garantías
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Piezas nuevas (NVO): garantía de <strong>90 días</strong> contra defectos de fabricación.</li>
                        <li>Piezas usadas (UBS) y reacondicionadas (REC): garantía de <strong>30 días</strong>.</li>
                        <li>La garantía no cubre daños por instalación incorrecta, mal uso, accidentes o desgaste normal.</li>
                        <li>Para hacer válida la garantía, presente el número de pedido y descripción del defecto.</li>
                    </ul>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        7. Propiedad Intelectual
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Todos los contenidos del sitio web (textos, imágenes, logotipos, diseño) son propiedad de Refaccionaria Vega o de sus respectivos titulares y están protegidos por las leyes de propiedad intelectual vigentes en México. Queda prohibida su reproducción total o parcial sin autorización expresa y por escrito.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        8. Limitación de Responsabilidad
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Refaccionaria Vega no será responsable de daños indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de usar nuestros productos o servicios, incluyendo daños al electrodoméstico causados por una instalación incorrecta de la refacción. Nuestra responsabilidad máxima se limita al monto pagado por el producto en cuestión.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        9. Ley Aplicable y Jurisdicción
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia será resuelta ante los tribunales competentes de Veracruz, México, renunciando las partes a cualquier otro fuero que pudiera corresponderles.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        10. Contacto
                    </h2>
                    <p className="text-gray-700">
                        Para consultas sobre estos términos, contáctenos en{' '}
                        <a href="mailto:contacto@refaccionariavega.com.mx" className="text-[#0A3981] underline">
                            contacto@refaccionariavega.com.mx
                        </a>{' '}
                        o al <strong>(232) 324-0000</strong>.
                    </p>
                </div>

                <p className="text-xs text-gray-400 text-center mt-4">
                    Última actualización: marzo 2026
                </p>
            </div>
        </div>
    )
}
