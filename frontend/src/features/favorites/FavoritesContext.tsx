'use client'

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react'
import { checkAuthentication } from '@/shared/lib/cookies'
import { getFavoritosIdsAction, agregarFavoritoAction, eliminarFavoritoAction } from '@/features/favorites/actions'

interface FavoritesContextType {
    isFavorite: (id: number) => boolean
    addFavorite: (id: number) => Promise<void>
    removeFavorite: (id: number) => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set())

    const fetchFavorites = useCallback(async () => {
        if (!checkAuthentication()) {
            setFavoriteIds(new Set())
            return
        }
        try {
            const ids = await getFavoritosIdsAction()
            setFavoriteIds(new Set(ids))
        } catch {
            // Silently fail — user won't see favorites pre-filled but can still toggle
        }
    }, [])

    useEffect(() => {
        fetchFavorites()
        window.addEventListener('cart-auth-changed', fetchFavorites)
        return () => window.removeEventListener('cart-auth-changed', fetchFavorites)
    }, [fetchFavorites])

    const isFavorite = useCallback((id: number) => favoriteIds.has(id), [favoriteIds])

    const addFavorite = useCallback(async (id: number) => {
        // Optimistic update
        setFavoriteIds((prev) => new Set([...prev, id]))
        try {
            const res = await agregarFavoritoAction(id)
            if (!res.success) throw new Error(res.error)
        } catch {
            // Revert on error
            setFavoriteIds((prev) => {
                const next = new Set(prev)
                next.delete(id)
                return next
            })
            throw new Error('Error al agregar favorito')
        }
    }, [])

    const removeFavorite = useCallback(async (id: number) => {
        // Optimistic update
        setFavoriteIds((prev) => {
            const next = new Set(prev)
            next.delete(id)
            return next
        })
        try {
            const res = await eliminarFavoritoAction(id)
            if (!res.success) throw new Error(res.error)
        } catch {
            // Revert on error
            setFavoriteIds((prev) => new Set([...prev, id]))
            throw new Error('Error al eliminar favorito')
        }
    }, [])

    const value = useMemo(
        () => ({ isFavorite, addFavorite, removeFavorite }),
        [isFavorite, addFavorite, removeFavorite],
    )

    return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavoritesContext() {
    const ctx = useContext(FavoritesContext)
    if (!ctx) throw new Error('useFavoritesContext must be used within FavoritesProvider')
    return ctx
}
