import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Política de Privacidad — Refaccionaria Vega',
    description: 'Aviso de privacidad de Refaccionaria Vega conforme a la LFPDPPP. Conoce cómo tratamos tus datos personales.',
    alternates: {
        canonical: 'https://www.refaccionariavega.com.mx/privacy-policy',
    },
}

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <div className="bg-[#0A3981] text-white py-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Política de Privacidad</h1>
                    <p className="text-blue-200">Aviso de privacidad conforme a la LFPDPPP</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        1. Responsable del Tratamiento
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        <strong>Refaccionaria Vega</strong>, con domicilio en Martínez de la Torre, Veracruz, México, es responsable del tratamiento de los datos personales que usted nos proporcione.
                        Para cualquier consulta relacionada con su privacidad, puede contactarnos en:{' '}
                        <a href="mailto:contacto@refaccionariavega.com.mx" className="text-[#0A3981] underline">
                            contacto@refaccionariavega.com.mx
                        </a>
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        2. Datos Personales que Recabamos
                    </h2>
                    <p className="text-gray-700 mb-3">Recabamos los siguientes datos cuando usted crea una cuenta, realiza un pedido o nos contacta:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Nombre completo</li>
                        <li>Correo electrónico</li>
                        <li>Número de teléfono</li>
                        <li>Dirección de entrega (calle, número, colonia, municipio, estado, código postal)</li>
                        <li>Datos de pago (procesados por MercadoPago; no los almacenamos directamente)</li>
                        <li>Historial de pedidos y navegación en el sitio</li>
                    </ul>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        3. Finalidad del Tratamiento
                    </h2>
                    <p className="text-gray-700 mb-3">Sus datos personales son utilizados para:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Procesar y gestionar sus pedidos y pagos</li>
                        <li>Enviarle confirmaciones, actualizaciones de envío y facturas</li>
                        <li>Brindar atención al cliente y soporte técnico</li>
                        <li>Mejorar la experiencia de navegación en el sitio</li>
                        <li>Cumplir con obligaciones legales y fiscales</li>
                        <li>Enviarle comunicaciones comerciales y promociones (solo si usted lo consintió expresamente)</li>
                    </ul>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        4. Transferencias de Datos
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Sus datos pueden ser compartidos con las siguientes terceras partes, exclusivamente para cumplir con las finalidades descritas:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 mt-3">
                        <li><strong>MercadoPago</strong> — procesamiento de pagos</li>
                        <li><strong>Estafeta / Paquetexpress</strong> — servicio de paquetería y entrega</li>
                        <li><strong>Brevo (SendinBlue)</strong> — envío de correos transaccionales</li>
                        <li><strong>Cloudinary</strong> — almacenamiento de imágenes</li>
                    </ul>
                    <p className="text-gray-700 mt-3">
                        No vendemos ni cedemos sus datos a terceros con fines comerciales propios de esas terceras partes.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        5. Derechos ARCO
                    </h2>
                    <p className="text-gray-700 mb-3">
                        Usted tiene derecho a <strong>A</strong>cceder, <strong>R</strong>ectificar, <strong>C</strong>ancelar u <strong>O</strong>ponerse al tratamiento de sus datos personales (derechos ARCO), conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).
                    </p>
                    <p className="text-gray-700 mb-3">Para ejercer sus derechos ARCO, envíenos una solicitud por correo a{' '}
                        <a href="mailto:contacto@refaccionariavega.com.mx" className="text-[#0A3981] underline">
                            contacto@refaccionariavega.com.mx
                        </a>{' '}
                        incluyendo:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Nombre completo y correo electrónico con el que está registrado</li>
                        <li>Descripción clara del derecho que desea ejercer</li>
                        <li>Copia de una identificación oficial</li>
                    </ul>
                    <p className="text-gray-700 mt-3">
                        Responderemos su solicitud en un plazo máximo de 20 días hábiles.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        6. Cookies y Tecnologías de Seguimiento
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Este sitio utiliza cookies de sesión necesarias para el funcionamiento del carrito de compras y la autenticación. También pueden emplearse cookies de análisis para entender cómo los usuarios interactúan con el sitio. Para más información, consulte nuestra{' '}
                        <a href="/cookie-policy" className="text-[#0A3981] underline">Política de Cookies</a>.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        7. Cambios a este Aviso
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Nos reservamos el derecho de actualizar este aviso de privacidad en cualquier momento. Los cambios serán publicados en esta página con la fecha de última actualización. Le recomendamos revisarla periódicamente.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        8. Contacto
                    </h2>
                    <p className="text-gray-700">
                        Para cualquier duda sobre este aviso de privacidad, escríbenos a{' '}
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
