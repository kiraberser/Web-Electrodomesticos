"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/forms/Button"
import { Badge } from "../ui"
import { Zap, Shield, Heart, Trash2 } from "lucide-react"
import { Refaccion } from "@/api/productos"
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'
import { eliminarFavoritoAction } from "@/actions/favoritos"
import { useState } from "react"

interface FavoritoCardProps {
    favorito: Refaccion
    onRemove?: (removedId?: number) => void
}

export default function FavoritoCard({ favorito, onRemove }: FavoritoCardProps) {
    const { addItem } = useCart()
    const [isRemoving, setIsRemoving] = useState(false)

    const handleAddToCart = () => {
        addItem({
            id: String(favorito.id),
            name: favorito.nombre,
            price: Number(favorito.precio),
            image: favorito.imagen || "/placeholder.svg",
            quantity: 1,
        })
        toast.success(`${favorito.nombre} agregado al carrito`, {
            duration: 3000,
            icon: '🛒',
            style: {
                background: '#0A3981',
                color: '#fff',
            },
        })
    }

    const handleRemoveFavorite = async () => {
        if (!favorito.id) return
        
        setIsRemoving(true)
        
        // Optimistic update - remover inmediatamente de la UI
        const removedId = favorito.id
        onRemove?.(removedId)
        
        try {
            const result = await eliminarFavoritoAction(favorito.id)
            if (!result.success) {
                // Revertir cambio optimista si falla
                onRemove?.() // Sin ID para revertir
                toast.error(result.error || 'Error al eliminar de favoritos', {
                    style: {
                        background: '#dc2626',
                        color: '#fff',
                    },
                })
            } else {
                toast.success('Producto eliminado de favoritos', {
                    style: {
                        background: '#0A3981',
                        color: '#fff',
                    },
                })
            }
        } catch (error: any) {
            // Revertir cambio optimista si falla
            onRemove?.() // Sin ID para revertir
            const errorMessage = error?.message || 'Error al eliminar de favoritos'
            toast.error(errorMessage, {
                style: {
                    background: '#dc2626',
                    color: '#fff',
                },
            })
        } finally {
            setIsRemoving(false)
        }
    }

    // Usar encodeURIComponent para mantener el formato correcto del nombre (con espacios y mayúsculas)
    const categoriaSlug = favorito.categoria_nombre ? encodeURIComponent(favorito.categoria_nombre) : 'productos'
    const productoSlug = encodeURIComponent(favorito.nombre)

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
            <Link
                href={`/categorias/${categoriaSlug}/${productoSlug}`}
                className="block"
                aria-label={`Ver ${favorito.nombre}`}
            >
                <div className="relative aspect-square w-full bg-gray-50">
                    <Image
                        src={favorito.imagen || "/placeholder.svg"}
                        alt={favorito.nombre}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                    {favorito.existencias === 0 && (
                        <Badge className="absolute left-3 top-3 bg-red-600 hover:bg-red-700 text-white">
                            Agotado
                        </Badge>
                    )}
                    <Badge className="absolute right-3 top-3 bg-[#0A3981] hover:bg-[#1F509A] text-white flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        <span>{favorito.marca_nombre || favorito.marca}</span>
                    </Badge>
                </div>
            </Link>

            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <Link
                        href={`/categorias/${categoriaSlug}/${productoSlug}`}
                        className="line-clamp-2 text-base font-semibold text-gray-900 hover:text-[#0A3981] transition-colors flex-1"
                    >
                        {favorito.nombre}
                    </Link>
                    <button
                        onClick={handleRemoveFavorite}
                        disabled={isRemoving}
                        className="p-1.5 rounded-full hover:bg-red-50 transition-colors text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Eliminar de favoritos"
                    >
                        <Heart className="h-5 w-5 fill-red-500" />
                    </button>
                </div>
                
                {favorito.descripcion && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500 mb-3">
                        {favorito.descripcion}
                    </p>
                )}

                <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-xl font-bold text-gray-900">
                            ${Number(favorito.precio).toLocaleString('es-MX', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })} MXN
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Shield className="h-3.5 w-3.5 text-[#0A3981]" />
                            <span>Garantía</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleAddToCart}
                            disabled={favorito.existencias === 0}
                            className="flex-1 bg-[#0A3981] hover:bg-[#1F509A] text-white cursor-pointer text-sm py-2"
                        >
                            Agregar al carrito
                        </Button>
                        <Button
                            onClick={handleRemoveFavorite}
                            disabled={isRemoving}
                            variant="outline"
                            className="px-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                            aria-label="Eliminar"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

