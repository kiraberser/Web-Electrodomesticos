'use client'

const Footer = () => {
    const year = new Date().getFullYear()

    return (
        <footer className="bg-white pt-10 text-[#1F509A]">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#0A3981]/20">
                    {/* Logo y descripción */}
                    <div>
                        <h3 className="text-2xl font-bold text-[#0A3981] mb-3">Refaccionaria Vega</h3>
                        <p className="text-sm leading-relaxed">
                            Repuestos y reparaciones confiables para tus electrodomésticos. Garantía, calidad y atención personalizada.
                        </p>
                        <div className="flex mt-4 gap-3">
                            <a href="#" className="hover:text-[#E38E49] transition-colors">
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="..." /></svg>
                            </a>
                            <a href="#" className="hover:text-[#E38E49] transition-colors">
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="..." /></svg>
                            </a>
                            <a href="#" className="hover:text-[#E38E49] transition-colors">
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="..." /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Enlaces rápidos */}
                    <div>
                        <h4 className="font-semibold mb-3 text-[#0A3981]">Navegación</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/" className="hover:text-[#E38E49]">Inicio</a></li>
                            <li><a href="/servicios" className="hover:text-[#E38E49]">Servicios</a></li>
                            <li><a href="/productos" className="hover:text-[#E38E49]">Repuestos</a></li>
                            <li><a href="/about-us" className="hover:text-[#E38E49]">Sobre nosotros</a></li>
                        </ul>
                    </div>

                    {/* Horarios */}
                    <div>
                        <h4 className="font-semibold mb-3 text-[#0A3981]">Horarios</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Lunes a Viernes: 9am - 6pm</li>
                            <li>Sábado: 10am - 3pm</li>
                            <li>Domingo: Cerrado</li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h4 className="font-semibold mb-3 text-[#0A3981]">Contáctanos</h4>
                        <ul className="space-y-2 text-sm">
                            <li>📍 Veracruz, México</li>
                            <li>📞 +52 229 123 4567</li>
                            <li>📧 contacto@refaccionariavega.mx</li>
                            <li>
                                <a
                                    href="https://wa.me/522291234567"
                                    target="_blank"
                                    className="inline-block mt-2 bg-[#E38E49] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#d47a32] transition"
                                >
                                    Escríbenos por WhatsApp
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Créditos */}
                <div className="text-center py-6 text-xs text-[#0A3981]">
                    © {year} Refaccionaria Vega. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    )
}

export default Footer
