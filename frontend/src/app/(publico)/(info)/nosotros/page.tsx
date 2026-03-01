import Image from 'next/image'
import type { Metadata } from 'next'
import { company } from '@/shared/data/company'

export const metadata: Metadata = {
    title: 'Nosotros',
    description: 'Más de 20 años en Martínez de la Torre, Veracruz. Conoce la historia de Refaccionaria Vega.',
    alternates: {
        canonical: 'https://www.refaccionariavega.com.mx/nosotros',
    },
}

export default function NosotrosPage() {
    return (
        <section className="relative bg-[#D4EBF8] overflow-hidden py-16 sm:py-24">
            <div className="absolute top-0 left-0 w-full h-full rotate-2 bg-[#E38E49]/10 pointer-events-none" />

            <div className="relative z-10 max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#0A3981] sm:text-5xl">¿Quiénes somos?</h1>
                    <p className="mt-4 text-[#1F509A] text-lg">
                        Más que un servicio técnico, somos una solución confiable para tu hogar
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Card 1 */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-[#0A3981] p-2 rounded-full text-white">
                                🔧
                            </div>
                            <h2 className="text-xl font-semibold text-[#0A3981]">Nuestro origen</h2>
                        </div>
                        <p className="text-[#1F509A]">
                            Nacimos hace más de 20 años con la misión de brindar soluciones técnicas accesibles, rápidas y de calidad para todos los hogares de Martínez de la Torre y la región. Nos especializamos en ventiladores, licuadoras y electrodomésticos del hogar, usando repuestos originales y de calidad.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-[#E38E49] p-2 rounded-full text-white">
                                🧰
                            </div>
                            <h2 className="text-xl font-semibold text-[#0A3981]">Lo que hacemos</h2>
                        </div>
                        <p className="text-[#1F509A]">
                            Ofrecemos venta de refacciones, reparación y mantenimiento de electrodomésticos con garantía. Trabajamos con marcas reconocidas como Mabe, Oster, Koblenz, Mirage, Siemens y NTN. Además, asesoramos a nuestros clientes para prolongar la vida útil de sus equipos.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-[#0A3981] p-2 rounded-full text-white">
                                🤝
                            </div>
                            <h2 className="text-xl font-semibold text-[#0A3981]">Nuestro compromiso</h2>
                        </div>
                        <p className="text-[#1F509A]">
                            Somos transparentes, cumplidos y cercanos. Cada refacción vendida y cada reparación realizada es una oportunidad para ayudarte y generar confianza. Nuestra prioridad es que vuelvas a usar tus equipos con tranquilidad. Envíamos a toda la república mexicana.
                        </p>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-[#E38E49] p-2 rounded-full text-white">
                                📍
                            </div>
                            <h2 className="text-xl font-semibold text-[#0A3981]">Dónde encontrarnos</h2>
                        </div>
                        <p className="text-[#1F509A]">
                            Estamos ubicados en <strong>{company.address}</strong>. Atendemos de {company.hours}. Puedes contactarnos al <strong>{company.phone}</strong> o por correo a{' '}
                            <a href={`mailto:${company.email}`} className="underline">{company.email}</a>.
                        </p>
                    </div>
                </div>

                {/* Imagen decorativa */}
                <div className="mt-16 flex justify-center">
                    <div className="relative w-full max-w-xl h-64 rounded-xl overflow-hidden shadow-lg">
                        <Image
                            src="https://images.unsplash.com/photo-1616627454662-6cd55cfe6554?q=80&w=1600&auto=format&fit=crop"
                            alt="Taller de reparación de electrodomésticos Refaccionaria Vega"
                            fill
                            className="object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#D4EBF8]/60 to-transparent" />
                    </div>
                </div>
            </div>
        </section>
    )
}
