import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Política de Cookies — Refaccionaria Vega',
    description: 'Información sobre el uso de cookies en el sitio web de Refaccionaria Vega y cómo gestionarlas.',
    alternates: {
        canonical: 'https://www.refaccionariavega.com.mx/cookie-policy',
    },
}

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <div className="bg-[#0A3981] text-white py-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Política de Cookies</h1>
                    <p className="text-blue-200">Cómo y para qué usamos cookies en este sitio web</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        ¿Qué son las Cookies?
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (computadora, teléfono o tablet) cuando visitas un sitio web. Permiten que el sitio recuerde tus preferencias y actividad para brindarte una mejor experiencia de navegación.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        Cookies que Usamos
                    </h2>
                    <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-1">Cookies de Sesión (Estrictamente Necesarias)</h3>
                            <p className="text-sm text-gray-600 mb-2">Esenciales para el funcionamiento del sitio. No pueden desactivarse.</p>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                <li><code className="bg-gray-100 px-1 rounded">access_cookie</code> — Token de autenticación JWT (HttpOnly)</li>
                                <li><code className="bg-gray-100 px-1 rounded">refresh_cookie</code> — Token de renovación de sesión (HttpOnly)</li>
                                <li><code className="bg-gray-100 px-1 rounded">username</code> — Nombre de usuario para mostrar en la interfaz</li>
                                <li><code className="bg-gray-100 px-1 rounded">csrftoken</code> — Protección contra ataques CSRF</li>
                            </ul>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-1">Cookies de Preferencias</h3>
                            <p className="text-sm text-gray-600 mb-2">Recuerdan tus configuraciones para personalizar tu experiencia.</p>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                <li>Idioma y región seleccionados</li>
                                <li>Productos en el carrito de compras</li>
                            </ul>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-1">Cookies Analíticas</h3>
                            <p className="text-sm text-gray-600 mb-2">Nos ayudan a entender cómo los visitantes interactúan con el sitio para mejorar su diseño y contenido.</p>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                <li>Páginas visitadas y tiempo de permanencia</li>
                                <li>Fuente de tráfico (búsqueda, redes sociales, directo)</li>
                                <li>Dispositivo y sistema operativo utilizados</li>
                            </ul>
                            <p className="text-xs text-gray-500 mt-2">
                                Los datos analíticos son agregados y anónimos; no identifican a personas individuales.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        Cookies de Terceros
                    </h2>
                    <p className="text-gray-700 mb-3">
                        Algunos servicios integrados en nuestro sitio pueden instalar sus propias cookies:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>MercadoPago</strong> — Necesarias para el proceso de pago seguro.</li>
                        <li><strong>Cloudinary</strong> — Para la entrega optimizada de imágenes.</li>
                    </ul>
                    <p className="text-gray-700 mt-3 text-sm">
                        Estas cookies están sujetas a las políticas de privacidad de cada proveedor. No tenemos control sobre ellas.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        Cómo Gestionar las Cookies
                    </h2>
                    <p className="text-gray-700 mb-3">
                        Puedes controlar y eliminar las cookies desde la configuración de tu navegador. Ten en cuenta que deshabilitar ciertas cookies puede afectar el funcionamiento del sitio (por ejemplo, no podrás iniciar sesión ni usar el carrito de compras).
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>
                            <strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios
                        </li>
                        <li>
                            <strong>Firefox:</strong> Configuración → Privacidad y seguridad → Cookies y datos del sitio
                        </li>
                        <li>
                            <strong>Safari:</strong> Preferencias → Privacidad → Cookies y datos del sitio web
                        </li>
                        <li>
                            <strong>Edge:</strong> Configuración → Cookies y permisos del sitio → Cookies y datos del sitio
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        Cambios a esta Política
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Podemos actualizar esta política en cualquier momento. Los cambios serán publicados en esta misma página con la nueva fecha de actualización. Te recomendamos revisarla periódicamente.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        Contacto
                    </h2>
                    <p className="text-gray-700">
                        Para dudas sobre el uso de cookies, escríbenos a{' '}
                        <a href="mailto:contacto@refaccionariavega.com.mx" className="text-[#0A3981] underline">
                            contacto@refaccionariavega.com.mx
                        </a>.
                        También puedes consultar nuestra{' '}
                        <a href="/privacy-policy" className="text-[#0A3981] underline">Política de Privacidad</a>.
                    </p>
                </div>

                <p className="text-xs text-gray-400 text-center mt-4">
                    Última actualización: marzo 2026
                </p>
            </div>
        </div>
    )
}
