"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Search, ShoppingCart, Menu, X, User, ChevronDown, MapPin, Heart, Package, ShoppingBag, Truck } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

import { Button } from "@/shared/ui/forms/Button"
import { Badge } from "@/shared/ui/feedback/Badge"
import { Input } from "@/shared/ui/forms/InputField"
import MobileMenu from "@/shared/ui/responsive/mobile-menu"
import CartDrawer from "@/features/cart/CartDrawer"
import InformationBar from "@/features/home/InformationBar"

import { useCart } from "@/features/cart/CartContext"
import { categories } from "@/shared/data/category"
import { company } from "@/shared/data/company"
import LogOutButton from "@/features/auth/LogOutButton"
import { LayoutDashboard } from "lucide-react"
import { checkAuthentication } from "@/shared/lib/cookies"

interface NavbarProps {
    username?: string
}

const Navbar: React.FC<NavbarProps> = ({ username }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)

    const router = useRouter()
    const pathname = usePathname()
    const searchInputRef = useRef<HTMLInputElement>(null)
    const userDropdownRef = useRef<HTMLDivElement>(null)
    const { getTotalItems } = useCart()

    const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            const query = searchQuery.trim()
            setSearchQuery("")
            setIsMenuOpen(false)
            router.push(`/categorias?search=${encodeURIComponent(query)}`)
        }
    }, [searchQuery, router])

    const handleCartClick = () => {
        if (!checkAuthentication()) {
            router.push("/cuenta/login")
            return
        }
        setIsCartOpen(true)
    }

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "k") {
                e.preventDefault()
                searchInputRef.current?.focus()
            }
            if (e.key === "Escape") {
                setIsMenuOpen(false)
                setIsUserDropdownOpen(false)
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [])

    return (
        <>
            <header className="sticky top-0 z-40 bg-white shadow-sm">
                <InformationBar />

                {/* Main Header */}
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center space-x-3 group flex-shrink-0"
                            aria-label="Ir a página principal"
                        >
                            <div className="hidden sm:block">
                                <span className="text-xl font-bold text-gray-800 group-hover:text-[#0A3981] transition-colors duration-150">
                                    {company.name}
                                </span>
                                <p className="text-xs text-gray-500 leading-tight">{company.tagline}</p>
                            </div>
                            <div className="sm:hidden">
                                <span className="text-lg font-bold text-gray-800">Vega</span>
                            </div>
                        </Link>

                        {/* Search Bar - Desktop */}
                        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8" role="search">
                            <div className="relative w-full">
                                <Input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Buscar refacciones... (Ctrl+K)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-4 pr-12 py-3 text-sm border-2 border-gray-200 rounded-xl transition-all duration-150 hover:border-gray-300 focus:border-[#0A3981] focus:ring-2 focus:ring-[#0A3981]/10"
                                    aria-label="Buscar productos"
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 p-0  text-[#0A3981] cursor-pointer bg-transparent border-2 border-[#0A3981] rounded-lg"
                                    aria-label="Buscar"
                                >
                                    <Search className="w-4 h-4" />
                                </Button>
                                {searchQuery && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-12 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600 cursor-pointer"
                                        onClick={() => setSearchQuery("")}
                                        aria-label="Limpiar búsqueda"
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                )}
                            </div>
                        </form>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                            {/* User Account - Desktop */}
                            <div className="hidden md:block relative" ref={userDropdownRef}>
                                {username ? (
                                    <div className="relative">
                                        <Button
                                            variant="ghost"
                                            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                            aria-expanded={isUserDropdownOpen}
                                            aria-haspopup="true"
                                        >
                                            <div className="w-8 h-8 bg-[#0A3981]/10 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-[#0A3981]" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-medium text-gray-700 truncate max-w-20">{username}</p>
                                                <p className="text-xs text-gray-500">Mi cuenta</p>
                                            </div>
                                            <ChevronDown
                                                className={`w-4 h-4 text-gray-400 transition-transform duration-150 ${isUserDropdownOpen ? "rotate-180" : ""}`}
                                            />
                                        </Button>

                                        {/* Dropdown */}
                                        {isUserDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                                <div className="px-4 py-3 border-b border-gray-100">
                                                    <p className="text-sm font-medium text-gray-900">¡Hola, {username}!</p>
                                                    <p className="text-xs text-gray-500">Gestiona tu cuenta</p>
                                                </div>

                                                <div className="py-1">
                                                    <Link
                                                        href="/cuenta/perfil"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                    >
                                                        <User className="w-4 h-4 mr-3 text-gray-400" />
                                                        Mi Perfil
                                                    </Link>
                                                    {username === "admin" && (
                                                        <Link
                                                            href="/admin/dashboard"
                                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                                            onClick={() => setIsUserDropdownOpen(false)}
                                                        >
                                                            <LayoutDashboard className="w-4 h-4 mr-3 text-gray-400" />
                                                            Dashboard
                                                        </Link>
                                                    )}
                                                    <div className="border-t border-gray-100 my-1"></div>
                                                    <Link
                                                        href="/cuenta/perfil/direcciones"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                    >
                                                        <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                                                        Direcciones
                                                    </Link>
                                                    <Link
                                                        href="/cuenta/perfil/favoritos"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                    >
                                                        <Heart className="w-4 h-4 mr-3 text-gray-400" />
                                                        Favoritos
                                                    </Link>
                                                    <Link
                                                        href="/cuenta/perfil/mis-compras"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                    >
                                                        <ShoppingBag className="w-4 h-4 mr-3 text-gray-400" />
                                                        Mis Compras
                                                    </Link>
                                                    <Link
                                                        href="/cuenta/perfil/pedidos"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                    >
                                                        <Package className="w-4 h-4 mr-3 text-gray-400" />
                                                        Pedidos
                                                    </Link>
                                                    <div className="border-t border-gray-100 my-1"></div>
                                                    <Link
                                                        href="/politicas-envio"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                    >
                                                        Políticas de Envío
                                                    </Link>
                                                </div>
                                                <LogOutButton />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Link href="/cuenta/login">
                                            <Button
                                                variant="ghost"
                                                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 cursor-pointer text-sm"
                                            >
                                                <User className="w-4 h-4" />
                                                <span className="hidden lg:inline">Iniciar Sesión</span>
                                            </Button>
                                        </Link>
                                        <Link href="/cuenta/register" className="hidden lg:block">
                                            <Button
                                                className="bg-[#0A3981] hover:bg-[#0A3981]/90 text-white text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors duration-150"
                                            >
                                                Crear Cuenta
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Order Tracking - Próximamente */}
                            <Button
                                variant="ghost"
                                className="relative hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 cursor-pointer text-gray-400"
                                aria-label="Rastrear pedido (próximamente)"
                                title="Rastrear pedido (próximamente)"
                                disabled
                            >
                                <Truck className="w-4 h-4" />
                                <span className="hidden lg:inline text-sm">Rastrear</span>
                                <span className="absolute -top-1.5 -right-1.5 bg-[#E38E49] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                                    Pronto
                                </span>
                            </Button>

                            {/* Shopping Cart */}
                            <Button
                                variant="outline"
                                className="relative flex items-center space-x-2 px-3 py-2 rounded-lg border-2 hover:bg-gray-50 transition-all duration-150 bg-transparent cursor-pointer"
                                onClick={handleCartClick}
                                aria-label={`Carrito de compras, ${getTotalItems()} artículos`}
                            >
                                <ShoppingCart className="w-4 h-4" />
                                <span className="hidden sm:inline font-medium">Carrito</span>
                                {getTotalItems() > 0 && (
                                    <Badge className="absolute -top-2 -right-2 bg-[#E38E49] hover:bg-[#E38E49] text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                                        {getTotalItems()}
                                    </Badge>
                                )}
                            </Button>

                            {/* Mobile Menu Toggle */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                                aria-expanded={isMenuOpen}
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Desktop Categories Navigation */}
                <nav className="bg-gray-50/80 border-t border-gray-100" role="navigation" aria-label="Navegación principal">
                    <div className="container mx-auto px-2">
                        <div className="hidden md:flex items-center space-x-1 py-2 overflow-x-auto">
                            <Link
                                href="/categorias"
                                className={`px-4 py-2 text-sm rounded-lg transition-all duration-150 font-medium whitespace-nowrap cursor-pointer ${
                                    pathname === "/categorias"
                                        ? "text-[#0A3981] bg-[#0A3981]/5"
                                        : "text-gray-600 hover:text-[#0A3981] hover:bg-white"
                                }`}
                            >
                                Todas las categorías
                            </Link>
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/categorias/${encodeURIComponent(category.key)}`}
                                    className={`px-4 py-2 text-sm rounded-lg transition-all duration-150 font-medium whitespace-nowrap cursor-pointer ${
                                        pathname === `/categorias/${category.key}`
                                            ? "text-[#0A3981] bg-[#0A3981]/5"
                                            : "text-gray-600 hover:text-[#0A3981] hover:bg-white"
                                    }`}
                                >
                                    {category.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                username={username}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchSubmit={handleSearch}
            />

            {/* Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    )
}

export default Navbar
