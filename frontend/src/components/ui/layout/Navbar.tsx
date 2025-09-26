"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Search, ShoppingCart, Menu, X, User, ChevronDown } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/forms/Button"
import { Badge } from "@/components/ui/feedback/Badge"
import { Input } from "@/components/ui/forms/InputField"
import MobileMenu from '@/components/ui/responsive/mobile-menu'
import CartDrawer from "@/components/cart/CartDrawer"
import InformationBar from "@/components/features/home/InformationBar"

import { useCart } from "@/context/CartContext"
import AccountModal from "../display/AccountModa"
import { categories } from "@/data/category"
import { company } from "@/data/company"
import LogOutButton from "@/components/user/LogOutButton"
import { LayoutDashboard } from "lucide-react"


interface NavbarProps {
    username?: string
}

const Navbar: React.FC<NavbarProps> = ({ username }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isAccountOpen, setIsAccountOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)

    // Scroll behavior states

    const searchInputRef = useRef<HTMLInputElement>(null)
    const userDropdownRef = useRef<HTMLDivElement>(null)
    const { getTotalItems } = useCart()

    // Handle search submission
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            const query = searchQuery.trim()
            setSearchQuery("")
            redirect(`/productos?search=${encodeURIComponent(query)}`)
        }
    }

    // Handle category navigation
    const handleCategoryClick = (categoryName: string) => {
        setIsMenuOpen(false)
        redirect(`/productos?category=${encodeURIComponent(categoryName)}`)
    }

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false)
            }
            if (isMenuOpen && !(event.target as Element).closest(".mobile-menu")) {
                setIsMenuOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isMenuOpen, isUserDropdownOpen])

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "k") {
                e.preventDefault()
                searchInputRef.current?.focus()
            }
            if (e.key === "Escape") {
                if (isMenuOpen) setIsMenuOpen(false)
                if (isUserDropdownOpen) setIsUserDropdownOpen(false)
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isMenuOpen, isUserDropdownOpen])

    return (
        <>
            <header
                className={`bg-white shadow-sm border-b top-0 left-0 right-0 z-40 transition-transform duration-300 ease-out"`}
            >
                <InformationBar/>
                {/* Main Header */}
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo Section */}
                        <Link
                            href="/"
                            className="flex items-center space-x-3 group flex-shrink-0 cursor-pointer"
                            aria-label="Ir a página principal"
                        >
                            {/* <div className="relative">
                                <Image
                                    src={Logo || "/placeholder.svg"}
                                    alt="Logo Refaccionaria Vega"
                                    width={50}
                                    height={50}
                                    className="transition-transform group-hover:scale-105 cursor-pointer"
                                    priority
                                />
                            </div> */}
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors cursor-pointer">
                                    {company.name}
                                </h1>
                                <p className="text-xs text-gray-500 leading-tight">{company.tagline}</p>
                            </div>
                        </Link>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8" role="search">
                            <div className="relative w-full group">
                                <Input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Buscar productos... (Ctrl+K)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className={`w-full pl-4 pr-12 py-3 text-sm border-2 rounded-xl transition-all duration-200 cursor-text ${isSearchFocused
                                            ? "border-blue-500 shadow-lg ring-4 ring-blue-100"
                                            : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    aria-label="Buscar productos"
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
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
                                            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                            aria-expanded={isUserDropdownOpen}
                                            aria-haspopup="true"
                                        >
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-medium text-gray-700 truncate max-w-20">{username}</p>
                                                <p className="text-xs text-gray-500">Mi cuenta</p>
                                            </div>
                                            <ChevronDown
                                                className={`w-4 h-4 text-gray-400 transition-transform ${isUserDropdownOpen ? "rotate-180" : ""}`}
                                            />
                                        </Button>

                                        {/* Custom Dropdown */}
                                        {isUserDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                                                <div className="px-4 py-3 border-b border-gray-100">
                                                    <p className="text-sm font-medium text-gray-900">¡Hola, {username}!</p>
                                                    <p className="text-xs text-gray-500">Gestiona tu cuenta</p>
                                                </div>

                                                <div className="py-1">
                                                    <Link
                                                        href="/mi-perfil"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                    >
                                                        <User className="w-4 h-4 mr-3 text-gray-400" />
                                                        Mi Perfil
                                                    </Link>
                                                    {username === "admin" && (
                                                        <Link
                                                            href="/admin/dashboard"
                                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                                            onClick={() => setIsUserDropdownOpen(false)}
                                                        >
                                                            <LayoutDashboard className="w-4 h-4 mr-3 text-gray-400" />
                                                            Dashboard
                                                        </Link>
                                                    )}
                                                    <Link
                                                        href="/mis-compras"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                    >
                                                        <ShoppingCart className="w-4 h-4 mr-3 text-gray-400" />
                                                        Mis Compras
                                                    </Link>
                                                    <Link
                                                        href="/politicas-envio"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                    >
                                                        Políticas de Envío
                                                    </Link>
                                                </div>
                                                <LogOutButton/>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                        onClick={() => setIsAccountOpen(true)}
                                    >
                                        <User className="w-4 h-4" />
                                        <span className="hidden lg:inline">Mi Cuenta</span>
                                    </Button>
                                )}
                            </div>

                            {/* Shopping Cart */}
                            <Button
                                variant="outline"
                                className="relative flex items-center space-x-2 px-3 py-2 rounded-lg border-2 hover:bg-gray-50 transition-all duration-200 bg-transparent cursor-pointer"
                                onClick={() => setIsCartOpen(true)}
                                aria-label={`Carrito de compras, ${getTotalItems()} artículos`}
                            >
                                <ShoppingCart className="w-4 h-4" />
                                <span className="hidden sm:inline font-medium">Carrito</span>
                                {getTotalItems() > 0 && (
                                    <Badge className="absolute -top-2 -right-2 bg-orange-500 hover:bg-orange-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full animate-pulse">
                                        {getTotalItems()}
                                    </Badge>
                                )}
                            </Button>

                            {/* Mobile Menu Toggle */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                                aria-expanded={isMenuOpen}
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="md:hidden mt-4" role="search">
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 cursor-text"
                                aria-label="Buscar productos"
                            />
                            <Button
                                type="submit"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                                aria-label="Buscar"
                            >
                                <Search className="w-4 h-4" />
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Desktop Navigation */}
                <nav className="bg-gray-50 border-t" role="navigation" aria-label="Navegación principal">
                    <div className="container mx-auto px-2">
                        <div className="hidden md:flex items-center space-x-1 py-3 overflow-x-auto">
                            <Link
                                href="/categorias"
                                className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-lg transition-all duration-200 font-medium whitespace-nowrap cursor-pointer"
                            >
                                Todas las categorias 
                            </Link>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.label)}
                                    className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-lg transition-all duration-200 font-medium whitespace-nowrap cursor-pointer"
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu */}
                <MobileMenu
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    categories={categories}
                    username={username}
                    onCategoryClick={handleCategoryClick}
                    onAccountOpen={() => setIsAccountOpen(true)}
                />
            </header>

            {/* Modals and Drawers */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <AccountModal isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
        </>
    )
}

export default Navbar