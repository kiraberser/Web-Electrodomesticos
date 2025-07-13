'use client'

import Link from 'next/link'
import { useState } from 'react'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <div className="relative">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link 
                            href="/" 
                            className="flex items-center space-x-2"
                            aria-label="Inicio"
                        >
                            <svg 
                                width="95" 
                                height="94" 
                                viewBox="0 0 95 94" 
                                className="h-8 w-8 text-blue-600" 
                                fill="currentColor" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M96 0V47L48 94H0V47L48 0H96Z" />
                            </svg>
                            <span className="text-xl font-bold text-gray-900">Vega</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex md:items-center md:space-x-8">
                            <Link 
                                href="/" 
                                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                            >
                                Inicio
                            </Link>
                            <Link 
                                href="/productos" 
                                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                            >
                                Productos
                            </Link>
                            <Link 
                                href="/blog" 
                                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                            >
                                Blog
                            </Link>
                            <Link 
                                href="/contacto" 
                                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                            >
                                Contacto
                            </Link>
                        </nav>

                        {/* Desktop CTA */}
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            <Link 
                                href="/cuenta/login" 
                                className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link 
                                href="/cuenta/registro" 
                                className="rounded-md bg-[#E38E49] px-4 py-2 text-sm font-medium text-white hover:bg-[#E39A10] transition-colors duration-200"
                            >
                                Registrarse
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Abrir menú principal</span>
                            {isMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            <Link 
                                href="/" 
                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Inicio
                            </Link>
                            <Link 
                                href="/productos" 
                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Productos
                            </Link>
                            <Link 
                                href="/blog" 
                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Blog
                            </Link>
                            <Link 
                                href="/contacto" 
                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contacto
                            </Link>
                            <div className="mt-4 space-y-2">
                                <Link 
                                    href="/login" 
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link 
                                    href="/registro" 
                                    className="block rounded-md bg-[#E38E49] px-3 py-2 text-base font-medium text-white hover:bg-blue-700"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Registrarse
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>
            {/* Spacer to prevent content from being hidden under fixed header */}
            <div className="h-16"></div>
        </div>
    )
}

export default Navbar