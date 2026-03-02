import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Política de Devoluciones — Refaccionaria Vega',
    description: 'Conoce la política de devoluciones y reembolsos de Refaccionaria Vega. 30 días para devolver tu compra.',
    alternates: {
        canonical: 'https://www.refaccionariavega.com.mx/devoluciones',
    },
}

export default function DevolucionesPage() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <div className="bg-[#0A3981] text-white py-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Política de Devoluciones</h1>
                    <p className="text-blue-200">30 días para devolver tu compra si no estás satisfecho</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        Política General de 30 Días
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        En Refaccionaria Vega queremos que estés satisfecho con tu compra. Si por cualquier motivo necesitas devolver un producto, tienes <strong>30 días naturales</strong> a partir de la fecha de entrega para iniciar una devolución, siempre que se cumplan las condiciones descritas a continuación.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        Condiciones para Aceptar la Devolución
                    </h2>
                    <p className="text-gray-700 mb-3">La pieza debe cumplir con todas las siguientes condiciones:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Estar en su <strong>empaque original</strong>, sin abrir o en condición equivalente a la recibida.</li>
                        <li><strong>No haber sido instalada</strong> ni conectada al electrodoméstico.</li>
                        <li>No presentar señales de uso, daños adicionales o modificaciones.</li>
                        <li>Estar acompañada del número de pedido.</li>
                    </ul>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        Proceso de Devolución Paso a Paso
                    </h2>
                    <ol className="list-decimal list-inside space-y-3 text-gray-700">
                        <li>
                            <strong>Contáctanos</strong> — Envía un correo a{' '}
                            <a href="mailto:contacto@refaccionariavega.com.mx" className="text-[#0A3981] underline">
                                contacto@refaccionariavega.com.mx
                            </a>{' '}
                            con tu número de pedido, el producto que deseas devolver y el motivo.
                        </li>
                        <li>
                            <strong>Aprobación</strong> — Revisaremos tu solicitud y te responderemos en un plazo máximo de 2 días hábiles con las instrucciones para el envío de devolución.
                        </li>
                        <li>
                            <strong>Envío de la pieza</strong> — Si el error fue nuestro (pieza incorrecta, defecto de fábrica), te enviaremos una guía prepagada sin costo. Si la devolución es por arrepentimiento, el costo de envío corre por tu cuenta.
                        </li>
                        <li>
                            <strong>Inspección</strong> — Al recibir la pieza, la inspeccionamos en 1 a 2 días hábiles para verificar su estado.
                        </li>
                        <li>
                            <strong>Reembolso o cambio</strong> — Una vez aprobada, procesamos el reembolso o el cambio de producto según tu preferencia.
                        </li>
                    </ol>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        Reembolsos
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Los reembolsos se procesan en un plazo de <strong>3 a 5 días hábiles</strong> tras la aprobación de la devolución.</li>
                        <li>El reembolso se realiza por el mismo método de pago utilizado en la compra original.</li>
                        <li>El tiempo en que el dinero aparezca en tu cuenta depende de tu banco o emisor de tarjeta (generalmente 3 a 10 días adicionales).</li>
                        <li>Los gastos de envío originales no son reembolsables, salvo que el error haya sido nuestro.</li>
                    </ul>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        Excepciones — Casos en que No Aplica la Devolución
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Piezas que ya hayan sido instaladas o conectadas al electrodoméstico.</li>
                        <li>Piezas con desgaste evidente por uso inadecuado o manipulación.</li>
                        <li>Productos dañados por causas externas (humedad, golpes, quemaduras).</li>
                        <li>Piezas personalizadas o fabricadas bajo pedido especial.</li>
                        <li>Solicitudes de devolución realizadas después de los 30 días naturales.</li>
                    </ul>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        Garantía por Defecto de Fabricación
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Si la pieza presentó un defecto de fábrica, aplica nuestra garantía independientemente del periodo de devolución: 90 días para piezas nuevas y 30 días para piezas usadas o reacondicionadas. Consulta los <a href="/terms-conditions" className="text-[#0A3981] underline">Términos y Condiciones</a> para más detalles.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#0A3981] border-b border-gray-200 pb-2 mb-4">
                        Contacto
                    </h2>
                    <p className="text-gray-700">
                        Para iniciar una devolución o resolver cualquier duda, escríbenos a{' '}
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
