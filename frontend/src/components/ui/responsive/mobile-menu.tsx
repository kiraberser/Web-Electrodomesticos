"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/forms/Button"
import { Badge } from "@/components/ui/feedback/Badge"
import { User, Package, ShoppingBag, FileText, Mail, ChevronRight, LogOut, Truck, Phone, MapPin } from "lucide-react"

interface Category {
    id: number
    key: string
    count?: number
    label: string
    cat_model: string
    description: string
    image: string
}

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
    categories: Category[]
    username?: string
    onCategoryClick: (categoryName: string) => void
    onAccountOpen: () => void
}

const MobileMenu: React.FC<MobileMenuProps> = ({
    isOpen,
    onClose,
    categories,
    username,
    onCategoryClick,
    onAccountOpen,
}) => {
    if (!isOpen) return null

    return (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg mobile-menu">
            <div className="px-4 py-6 max-h-[80vh] overflow-y-auto">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <Link
                        href="/contacto"
                        className="flex items-center justify-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                        onClick={onClose}
                    >
                        <Phone className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-700">Llamar</span>
                    </Link>
                    <Link
                        href="/contacto"
                        className="flex items-center justify-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                        onClick={onClose}
                    >
                        <MapPin className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-700">Ubicación</span>
                    </Link>
                </div>

                {/* Main Navigation */}
                <div className="space-y-1 mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Navegación</h3>

                    <Link
                        href="/productos"
                        className="flex items-center justify-between px-3 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group cursor-pointer"
                        onClick={onClose}
                    >
                        <div className="flex items-center">
                            <Package className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
                            <span className="font-medium">Todos los Productos</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                    </Link>

                    <Link
                        href="/blog"
                        className="flex items-center justify-between px-3 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group cursor-pointer"
                        onClick={onClose}
                    >
                        <div className="flex items-center">
                            <FileText className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
                            <span className="font-medium">Blog</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                    </Link>

                    <Link
                        href="/contacto"
                        className="flex items-center justify-between px-3 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group cursor-pointer"
                        onClick={onClose}
                    >
                        <div className="flex items-center">
                            <Mail className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
                            <span className="font-medium">Contacto</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                    </Link>
                </div>

                {/* Separator */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Categories */}
                {categories.length > 0 && (
                    <div className="space-y-1 mb-6">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Categorías</h3>

                        <div className="space-y-1">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        onCategoryClick(category.key)
                                        onClose()
                                    }}
                                    className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group text-left cursor-pointer"
                                >
                                    <span className="font-medium">{category.label}</span>
                                    <div className="flex items-center">
                                        {category.count && (
                                            <Badge variant="secondary" className="mr-2 text-xs">
                                                {category.count}
                                            </Badge>
                                        )}
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Separator */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Account Section */}
                <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Mi Cuenta</h3>

                    {username ? (
                        <div className="space-y-1">
                            {/* Welcome Message */}
                            <div className="px-3 py-3 bg-blue-50 rounded-lg mb-3">
                                <p className="text-sm font-medium text-blue-900">¡Hola, {username}! 👋</p>
                                <p className="text-xs text-blue-600">Bienvenido de vuelta</p>
                            </div>

                            {/* Account Links */}
                            <Link
                                href="/mi-perfil"
                                className="flex items-center justify-between px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group cursor-pointer"
                                onClick={onClose}
                            >
                                <div className="flex items-center">
                                    <User className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" />
                                    <span className="font-medium">Mi Perfil</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                            </Link>

                            <Link
                                href="/mis-compras"
                                className="flex items-center justify-between px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group cursor-pointer"
                                onClick={onClose}
                            >
                                <div className="flex items-center">
                                    <ShoppingBag className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" />
                                    <span className="font-medium">Mis Compras</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                            </Link>

                            <Link
                                href="/politicas-envio"
                                className="flex items-center justify-between px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group cursor-pointer"
                                onClick={onClose}
                            >
                                <div className="flex items-center">
                                    <Truck className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" />
                                    <span className="font-medium">Políticas de Envío</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                            </Link>

                            {/* Separator */}
                            <div className="border-t border-gray-200 my-4"></div>

                            {/* Logout Button */}
                            <form action="/logout" method="POST">
                                <button
                                    type="submit"
                                    className="flex items-center w-full px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group cursor-pointer"
                                >
                                    <LogOut className="w-5 h-5 mr-3 group-hover:text-red-700" />
                                    <span className="font-medium">Cerrar Sesión</span>
                                </button>
                            </form>
                        </div>
                    ) : (
                        <Button
                            variant="default"
                            size="lg"
                            className="w-full justify-start bg-blue-600 hover:bg-blue-700 cursor-pointer"
                            onClick={() => {
                                onAccountOpen()
                                onClose()
                            }}
                        >
                            <User className="w-5 h-5 mr-3" />
                            Iniciar Sesión
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MobileMenu