"use client"

import { Refaccion } from "@/features/catalog/api"
import FavoritoCard from "./FavoritoCard"
import { useState, useEffect } from "react"

interface FavoritosListProps {
    favoritos: Refaccion[]
    onRemove?: (removedId?: number) => void
}

export default function FavoritosList({ favoritos, onRemove }: FavoritosListProps) {
    const [localFavoritos, setLocalFavoritos] = useState(favoritos)

    useEffect(() => {
        setLocalFavoritos(favoritos)
    }, [favoritos])

    const handleRemove = (removedId?: number) => {
        // Actualizar lista local optimistamente removiendo el item eliminado
        if (removedId) {
            setLocalFavoritos(prev => prev.filter(f => f.id !== removedId))
        }
        onRemove?.()
    }

    if (localFavoritos.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No tienes productos favoritos
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                        Cuando agregues productos a tus favoritos, aparecerán aquí.
                    </p>
                    <a
                        href="/categorias"
                        className="inline-flex items-center px-6 py-3 bg-[#0A3981] hover:bg-[#1F509A] text-white font-medium rounded-lg transition-colors"
                    >
                        Explorar productos
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {localFavoritos.map((favorito) => (
                <FavoritoCard
                    key={favorito.id}
                    favorito={favorito}
                    onRemove={handleRemove}
                />
            ))}
        </div>
    )
}

