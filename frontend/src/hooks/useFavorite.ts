'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { checkAuthentication } from '@/lib/cookies'
import { agregarFavoritoAction, eliminarFavoritoAction, checkFavoritoAction } from '@/actions/favoritos'
import toast from 'react-hot-toast'

export function useFavorite(productId: number) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const isProcessingRef = useRef(false)

  const isAuthenticated = typeof window !== 'undefined' ? checkAuthentication() : false

  // Check initial favorite state on mount (only if authenticated)
  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false
    checkFavoritoAction(productId).then((result) => {
      if (!cancelled && result.success) {
        setIsFavorite(result.isFavorite)
      }
    })
    return () => { cancelled = true }
  }, [productId, isAuthenticated])

  const toggleFavorite = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    if (isProcessingRef.current) return
    isProcessingRef.current = true
    setIsLoading(true)

    // Optimistic update
    const prevState = isFavorite
    setIsFavorite(!prevState)

    try {
      const result = prevState
        ? await eliminarFavoritoAction(productId)
        : await agregarFavoritoAction(productId)

      if (!result.success) {
        setIsFavorite(prevState) // Revert
        toast.error(result.error || 'Error al actualizar favoritos')
      } else {
        toast.success(prevState ? 'Eliminado de favoritos' : 'Agregado a favoritos')
      }
    } catch {
      setIsFavorite(prevState) // Revert
      toast.error('Error al actualizar favoritos')
    } finally {
      setIsLoading(false)
      isProcessingRef.current = false
    }
  }, [isFavorite, productId, isAuthenticated])

  const closeAuthModal = useCallback(() => {
    setShowAuthModal(false)
  }, [])

  return { isFavorite, isLoading, showAuthModal, toggleFavorite, closeAuthModal }
}
