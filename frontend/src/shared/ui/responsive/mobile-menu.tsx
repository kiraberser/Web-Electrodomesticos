"use client"

import type React from "react"
import { useEffect } from "react"
import Link from "next/link"
import { Search, X, User, Package, ShoppingBag, ChevronRight, MapPin, Heart, LayoutDashboard } from "lucide-react"
import { Button } from "@/shared/ui/forms/Button"
import { Input } from "@/shared/ui/forms/InputField"
import { categories } from "@/shared/data/category"
import LogOutButton from "@/features/auth/LogOutButton"

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
    username?: string
    searchQuery: string
    onSearchChange: (value: string) => void
    onSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const MobileMenu: React.FC<MobileMenuProps> = ({
    isOpen,
    onClose,
    username,
    searchQuery,
    onSearchChange,
    onSearchSubmit,
}) => {
    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen])

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Slide-in Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-xl transform transition-transform duration-200 ease-out md:hidden ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
                role="dialog"
                aria-modal="true"
                aria-label="Menú de navegación"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Menú</h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={onClose}
                        aria-label="Cerrar menú"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto h-[calc(100%-65px)]">
                    {/* Search */}
                    <div className="px-4 py-4 border-b border-gray-100">
                        <form onSubmit={onSearchSubmit} role="search">
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Buscar refacciones..."
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className="w-full pl-4 pr-10 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:border-[#0A3981] focus:ring-2 focus:ring-[#0A3981]/10 transition-all duration-150"
                                    aria-label="Buscar productos"
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 bg-[#0A3981] hover:bg-[#0A3981]/90 rounded-lg cursor-pointer"
                                    aria-label="Buscar"
                                >
                                    <Search className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Categories */}
                    <div className="px-4 py-4 border-b border-gray-100">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Categorías
                        </h3>
                        <div className="space-y-0.5">
                            <Link
                                href="/categorias"
                                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#0A3981] transition-colors duration-150 group"
                                onClick={onClose}
                            >
                                <span className="text-sm font-medium">Todas las categorías</span>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#0A3981]" />
                            </Link>
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/categorias/${encodeURIComponent(category.key)}`}
                                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#0A3981] transition-colors duration-150 group"
                                    onClick={onClose}
                                >
                                    <span className="text-sm font-medium">{category.label}</span>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#0A3981]" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Account Section */}
                    <div className="px-4 py-4">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Mi Cuenta
                        </h3>

                        {username ? (
                            <div className="space-y-0.5">
                                {/* Welcome */}
                                <div className="px-3 py-3 bg-[#0A3981]/5 rounded-lg mb-3">
                                    <p className="text-sm font-medium text-[#0A3981]">Hola, {username}</p>
                                </div>

                                <Link
                                    href="/cuenta/perfil"
                                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#0A3981] transition-colors duration-150 group"
                                    onClick={onClose}
                                >
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 mr-3 text-gray-400 group-hover:text-[#0A3981]" />
                                        <span className="text-sm font-medium">Mi Perfil</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#0A3981]" />
                                </Link>

                                {username === "admin" && (
                                    <Link
                                        href="/admin/dashboard"
                                        className="flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#0A3981] transition-colors duration-150 group"
                                        onClick={onClose}
                                    >
                                        <div className="flex items-center">
                                            <LayoutDashboard className="w-4 h-4 mr-3 text-gray-400 group-hover:text-[#0A3981]" />
                                            <span className="text-sm font-medium">Dashboard</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#0A3981]" />
                                    </Link>
                                )}

                                <Link
                                    href="/cuenta/perfil/direcciones"
                                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#0A3981] transition-colors duration-150 group"
                                    onClick={onClose}
                                >
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-3 text-gray-400 group-hover:text-[#0A3981]" />
                                        <span className="text-sm font-medium">Direcciones</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#0A3981]" />
                                </Link>

                                <Link
                                    href="/cuenta/perfil/favoritos"
                                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#0A3981] transition-colors duration-150 group"
                                    onClick={onClose}
                                >
                                    <div className="flex items-center">
                                        <Heart className="w-4 h-4 mr-3 text-gray-400 group-hover:text-[#0A3981]" />
                                        <span className="text-sm font-medium">Favoritos</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#0A3981]" />
                                </Link>

                                <Link
                                    href="/cuenta/perfil/mis-compras"
                                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#0A3981] transition-colors duration-150 group"
                                    onClick={onClose}
                                >
                                    <div className="flex items-center">
                                        <ShoppingBag className="w-4 h-4 mr-3 text-gray-400 group-hover:text-[#0A3981]" />
                                        <span className="text-sm font-medium">Mis Compras</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#0A3981]" />
                                </Link>

                                <Link
                                    href="/cuenta/perfil/pedidos"
                                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#0A3981] transition-colors duration-150 group"
                                    onClick={onClose}
                                >
                                    <div className="flex items-center">
                                        <Package className="w-4 h-4 mr-3 text-gray-400 group-hover:text-[#0A3981]" />
                                        <span className="text-sm font-medium">Pedidos</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#0A3981]" />
                                </Link>

                                {/* Logout */}
                                <div className="border-t border-gray-100 mt-3 pt-3">
                                    <LogOutButton />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Link href="/cuenta/login" onClick={onClose}>
                                    <Button className="w-full bg-[#0A3981] hover:bg-[#0A3981]/90 text-white cursor-pointer">
                                        <User className="w-4 h-4 mr-2" />
                                        Iniciar Sesión
                                    </Button>
                                </Link>
                                <Link href="/cuenta/register" onClick={onClose}>
                                    <Button variant="outline" className="w-full cursor-pointer mt-2">
                                        Crear Cuenta
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MobileMenu
