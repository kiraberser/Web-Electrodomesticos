'use client'

import { useState, useRef, useCallback } from 'react'
import { checkAuthentication } from '@/shared/lib/cookies'
import { useFavoritesContext } from '@/features/favorites/FavoritesContext'
import toast from 'react-hot-toast'

export function useFavorite(productId: number) {
    const { isFavorite, addFavorite, removeFavorite } = useFavoritesContext()
    const [isLoading, setIsLoading] = useState(false)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const isProcessingRef = useRef(false)

    const toggleFavorite = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!checkAuthentication()) {
            setShowAuthModal(true)
            return
        }

        if (isProcessingRef.current) return
        isProcessingRef.current = true
        setIsLoading(true)

        const currentlyFavorite = isFavorite(productId)

        try {
            if (currentlyFavorite) {
                await removeFavorite(productId)
                toast.success('Eliminado de favoritos')
            } else {
                await addFavorite(productId)
                toast.success('Agregado a favoritos')
            }
        } catch {
            toast.error('Error al actualizar favoritos')
        } finally {
            setIsLoading(false)
            isProcessingRef.current = false
        }
    }, [isFavorite, addFavorite, removeFavorite, productId])

    const closeAuthModal = useCallback(() => setShowAuthModal(false), [])

    return {
        isFavorite: isFavorite(productId),
        isLoading,
        showAuthModal,
        toggleFavorite,
        closeAuthModal,
    }
}
