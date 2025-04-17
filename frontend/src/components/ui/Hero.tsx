'use client'

import Link from 'next/link'
import Image from 'next/image'

export const HeroSection = () => {
    return (
        <div className="bg-[#D4EBF8] pb-6 sm:pb-8 lg:pb-12 min-h-screen">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                <section className="flex flex-col justify-between gap-6 sm:gap-10 md:gap-16 lg:flex-row">
                    <div className="flex flex-col justify-center sm:text-center lg:py-12 lg:text-left xl:w-5/12 xl:py-24">
                        <p className="mb-4 font-semibold text-[#E38E49] md:mb-6  md:text-lg xl:text-xl">Servicio profesional garantizado</p>

                        <h1 className="mb-8 text-4xl font-bold text-[#0A3981] sm:text-5xl md:mb-12 md:text-6xl">Reparaciones y repuestos para tus electrodomésticos</h1>

                        <p className="mb-8 leading-relaxed text-[#1F509A] md:mb-12 lg:w-4/5 xl:text-lg">Soluciones rápidas y confiables para la reparación de tus electrodomésticos con repuestos originales y técnicos certificados. Garantía en todos nuestros servicios.</p>

                        <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center lg:justify-start">
                            <Link 
                                href="/servicios" 
                                className="inline-block rounded-lg bg-[#E38E49] px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-[#1F509A] transition duration-300 hover:bg-[#d47a32] focus-visible:ring active:bg-[#c46e2b] md:text-base"
                            >
                                Solicitar servicio
                            </Link>

                            <Link 
                                href="/productos" 
                                className="inline-block rounded-lg bg-[#1F509A] px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-[#0A3981] transition duration-300 hover:bg-[#174584] focus-visible:ring active:text-white md:text-base"
                            >
                                Ver repuestos
                            </Link>
                        </div>
                        <div className="mt-6 flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <div className="flex text-[#E38E49]">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-lg font-bold text-[#0A3981]">4.9</span>
                                    <span className="text-sm text-gray-600">/5</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Image
                                    src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
                                    alt="Google"
                                    width={70}
                                    height={20}
                                    className="h-5 w-auto"
                                />
                                <span className="text-sm font-medium text-[#1F509A]">
                                    <span className="font-semibold text-xl">15+</span> reseñas
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative h-48 overflow-hidden rounded-lg bg-white shadow-lg lg:h-auto xl:w-5/12 m-5">
                        <Image
                            src="https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Técnico reparando electrodoméstico"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#D4EBF8]/20 to-transparent"></div>
                    </div>
                </section>

                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-12 lg:grid-cols-4">
                    <div className="flex flex-col items-center rounded-lg bg-white p-4 text-center shadow-sm">
                        <div className="mb-2 rounded-full bg-[#D4EBF8] p-2">
                            <svg className="h-6 w-6 text-[#0A3981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-[#0A3981]">Servicio Rápido</h3>
                        <p className="text-xs text-gray-600">24/7</p>
                    </div>

                    <div className="flex flex-col items-center rounded-lg bg-white p-4 text-center shadow-sm">
                        <div className="mb-2 rounded-full bg-[#D4EBF8] p-2">
                            <svg className="h-6 w-6 text-[#0A3981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-[#0A3981]">Garantía</h3>
                        <p className="text-xs text-gray-600">100% Garantizado</p>
                    </div>

                    <div className="flex flex-col items-center rounded-lg bg-white p-4 text-center shadow-sm">
                        <div className="mb-2 rounded-full bg-[#D4EBF8] p-2">
                            <svg className="h-6 w-6 text-[#0A3981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-[#0A3981]">Repuestos</h3>
                        <p className="text-xs text-gray-600">Originales</p>
                    </div>

                    <div className="flex flex-col items-center rounded-lg bg-white p-4 text-center shadow-sm">
                        <div className="mb-2 rounded-full bg-[#D4EBF8] p-2">
                            <svg className="h-6 w-6 text-[#0A3981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-[#0A3981]">Técnicos</h3>
                        <p className="text-xs text-gray-600">Certificados</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection