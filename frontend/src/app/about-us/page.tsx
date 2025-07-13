'use client'

import Image from 'next/image'

const AboutUsSection = () => {
    return (
        <section className="relative bg-[#D4EBF8] overflow-hidden py-16 sm:py-24">
            <div className="absolute top-0 left-0 w-full h-full rotate-2 bg-[#E38E49]/10 pointer-events-none" />

            <div className="relative z-10 max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-[#0A3981] sm:text-5xl">¿Quiénes somos?</h2>
                    <p className="mt-4 text-[#1F509A] text-lg">
                        Más que un servicio técnico, somos una solución confiable para tu hogar
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Timeline Card 1 */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-[#0A3981] p-2 rounded-full text-white">
                                🔧
                            </div>
                            <h3 className="text-xl font-semibold text-[#0A3981]">Nuestro origen</h3>
                        </div>
                        <p className="text-[#1F509A]">
                            Nacimos con la misión de brindar soluciones técnicas accesibles, rápidas y de calidad para todos los hogares. Nos especializamos en ventiladores, licuadoras y electrodomésticos comunes, usando repuestos originales.
                        </p>
                    </div>

                    {/* Timeline Card 2 */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-[#E38E49] p-2 rounded-full text-white">
                                🧰
                            </div>
                            <h3 className="text-xl font-semibold text-[#0A3981]">Lo que hacemos</h3>
                        </div>
                        <p className="text-[#1F509A]">
                            Ofrecemos reparación, mantenimiento y venta de repuestos con garantía. Además, asesoramos a nuestros clientes para que prolonguen la vida útil de sus electrodomésticos.
                        </p>
                    </div>

                    {/* Timeline Card 3 */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-[#0A3981] p-2 rounded-full text-white">
                                🤝
                            </div>
                            <h3 className="text-xl font-semibold text-[#0A3981]">Nuestro compromiso</h3>
                        </div>
                        <p className="text-[#1F509A]">
                            Somos transparentes, cumplidos y cercanos. Cada reparación es una oportunidad para ayudarte y generar confianza. Nuestra prioridad es que vuelvas a usar tus equipos con tranquilidad.
                        </p>
                    </div>

                    {/* Timeline Card 4 */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-[#E38E49] p-2 rounded-full text-white">
                                🌱
                            </div>
                            <h3 className="text-xl font-semibold text-[#0A3981]">Pensamos en el futuro</h3>
                        </div>
                        <p className="text-[#1F509A]">
                            Reparar es también una forma de cuidar el planeta. Al evitar desechar electrodomésticos, contribuimos a una economía más sustentable y responsable.
                        </p>
                    </div>
                </div>

                {/* Imagen decorativa */}
                <div className="mt-16 flex justify-center">
                    <div className="relative w-full max-w-xl h-64 rounded-xl overflow-hidden shadow-lg">
                        <Image
                            src="https://images.unsplash.com/photo-1616627454662-6cd55cfe6554?q=80&w=1600&auto=format&fit=crop"
                            alt="Reparación técnica"
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

export default AboutUsSection
