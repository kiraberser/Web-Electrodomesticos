import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Preguntas Frecuentes — Refaccionaria Vega',
    description: 'Resuelve tus dudas sobre pedidos, envíos, devoluciones, garantías y productos de Refaccionaria Vega.',
    alternates: {
        canonical: 'https://www.refaccionariavega.com.mx/faq',
    },
}

const faqSections = [
    {
        title: 'Pedidos y Pagos',
        questions: [
            {
                q: '¿Cómo realizo un pedido en línea?',
                a: 'Navega al catálogo, selecciona las refacciones que necesitas y agrégalas al carrito. Al finalizar, inicia sesión o regístrate, elige tu dirección de entrega y selecciona el método de pago. Recibirás una confirmación por correo electrónico.',
            },
            {
                q: '¿Qué métodos de pago aceptan?',
                a: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express) a través de MercadoPago. También puedes pagar en efectivo con el código QR o en tiendas de conveniencia mediante MercadoPago. Los precios están en pesos mexicanos (MXN).',
            },
            {
                q: '¿Mis datos de pago están seguros?',
                a: 'Sí. Todos los pagos se procesan a través de MercadoPago, una plataforma certificada PCI DSS. Nunca almacenamos los datos de tu tarjeta en nuestros servidores.',
            },
            {
                q: '¿Puedo cancelar un pedido?',
                a: 'Puedes cancelar tu pedido mientras esté en estado "Creado" o "Pagado" y aún no haya sido enviado. Escríbenos a contacto@refaccionariavega.com.mx o llámanos al (232) 324-0000 lo antes posible.',
            },
        ],
    },
    {
        title: 'Envíos',
        questions: [
            {
                q: '¿A qué zonas hacen envíos?',
                a: 'Enviamos a toda la República Mexicana a través de Estafeta y Paquetexpress. No realizamos envíos internacionales.',
            },
            {
                q: '¿Cuánto tarda en llegar mi pedido?',
                a: 'El tiempo de entrega es de 3 a 7 días hábiles dependiendo de la zona. Martínez de la Torre y municipios cercanos pueden recibir el pedido en 1 a 3 días hábiles.',
            },
            {
                q: '¿Cuál es el costo de envío?',
                a: 'El envío es gratuito en pedidos mayores a $800 MXN. Para pedidos menores, el costo se calcula según el peso del paquete y la zona de entrega; lo verás desglosado antes de confirmar tu compra.',
            },
            {
                q: '¿Cómo puedo rastrear mi pedido?',
                a: 'Una vez que tu pedido sea enviado, recibirás un correo con el número de guía. Puedes rastrearlo directamente en el sitio web de la paquetería correspondiente o en la sección "Mis Pedidos" de tu cuenta.',
            },
        ],
    },
    {
        title: 'Devoluciones y Garantías',
        questions: [
            {
                q: '¿Cuál es la política de devoluciones?',
                a: 'Aceptamos devoluciones dentro de los 30 días naturales posteriores a la fecha de entrega, siempre que la pieza esté en su empaque original, sin haber sido instalada y con las mismas condiciones en que fue recibida.',
            },
            {
                q: '¿Cómo inicio una devolución?',
                a: 'Contáctanos por correo a contacto@refaccionariavega.com.mx indicando tu número de pedido y el motivo de la devolución. Te enviaremos las instrucciones y la guía de devolución prepagada si el error fue nuestro.',
            },
            {
                q: '¿Cuándo recibo mi reembolso?',
                a: 'Una vez recibida e inspeccionada la pieza, procesamos el reembolso en 3 a 5 días hábiles. El tiempo en que aparezca en tu cuenta depende de tu banco o método de pago.',
            },
            {
                q: '¿Las refacciones tienen garantía?',
                a: 'Todas nuestras piezas nuevas tienen garantía de 90 días contra defectos de fabricación. Las piezas usadas o reacondicionadas tienen 30 días de garantía. La garantía no cubre daños por instalación incorrecta o mal uso.',
            },
        ],
    },
    {
        title: 'Productos y Refacciones',
        questions: [
            {
                q: '¿Cómo sé si la refacción es compatible con mi electrodoméstico?',
                a: 'En cada producto encontrarás la sección "Compatibilidad" con los modelos en que funciona esa pieza. Si tienes dudas, contáctanos con el modelo de tu electrodoméstico y te ayudamos a identificar la refacción correcta.',
            },
            {
                q: '¿Qué significa el estado NVO, UBS o REC en los productos?',
                a: 'NVO = Nuevo (pieza original sin uso), UBS = Usado en buen estado (funcional, con desgaste normal), REC = Reacondicionado (reparado o restaurado). El precio varía según el estado.',
            },
            {
                q: '¿Trabajan con todas las marcas?',
                a: 'Tenemos refacciones para las marcas más comunes en México: Mabe, Whirlpool, Oster, Koblenz, Mirage, Siemens, NTN, entre otras. Si no encuentras lo que buscas, escríbenos y lo gestionamos.',
            },
        ],
    },
    {
        title: 'Soporte Técnico y Cuenta',
        questions: [
            {
                q: '¿Ofrecen servicio de reparación a domicilio?',
                a: 'Contamos con servicio de reparación en nuestra tienda física en Martínez de la Torre, Veracruz. Por el momento no ofrecemos servicio a domicilio fuera de la zona local.',
            },
            {
                q: '¿Cómo creo una cuenta?',
                a: 'Haz clic en "Registrarse" en la parte superior del sitio, llena el formulario con tu nombre, correo electrónico y contraseña. Recibirás un correo de confirmación para activar tu cuenta.',
            },
            {
                q: '¿Olvidé mi contraseña, qué hago?',
                a: 'En la página de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?" e ingresa tu correo. Te enviaremos un enlace para restablecerla.',
            },
        ],
    },
]

export default function FAQPage() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <div className="bg-[#0A3981] text-white py-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Preguntas Frecuentes</h1>
                    <p className="text-blue-200">
                        Todo lo que necesitas saber sobre pedidos, envíos, devoluciones y productos.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="space-y-10">
                    {faqSections.map((section) => (
                        <div key={section.title}>
                            <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                                {section.title}
                            </h2>
                            <div className="space-y-3">
                                {section.questions.map((item) => (
                                    <details
                                        key={item.q}
                                        className="bg-white rounded-xl shadow-sm border border-gray-100 group"
                                    >
                                        <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-medium text-gray-900 list-none select-none">
                                            <span>{item.q}</span>
                                            <span className="ml-4 flex-shrink-0 text-[#E38E49] text-lg font-light transition-transform group-open:rotate-45">
                                                +
                                            </span>
                                        </summary>
                                        <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                                            {item.a}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-14 bg-blue-50 rounded-xl p-8 text-center">
                    <h2 className="text-lg font-semibold text-[#0A3981] mb-2">¿No encontraste tu respuesta?</h2>
                    <p className="text-gray-600 mb-4">
                        Escríbenos y te respondemos a la brevedad.
                    </p>
                    <a
                        href="/contacto"
                        className="inline-flex items-center gap-2 bg-[#E38E49] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#c97d3e] transition-colors"
                    >
                        Contactar soporte
                    </a>
                </div>

                <p className="text-xs text-gray-400 text-center mt-10">
                    Última actualización: marzo 2026
                </p>
            </div>
        </div>
    )
}
