"use client"

import { useState, useEffect } from 'react'
import { checkAuthentication } from '@/shared/lib/cookies'

export function useAuthModal() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') return checkAuthentication()
    return false
  })
  const [isMounted, setIsMounted] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setIsAuthenticated(checkAuthentication())
  }, [])

  // Listener is ONLY active when modal is open — prevents duplicate visibilitychange handlers
  // that would conflict with useFavoriteSync (Vercel: client-event-listeners)
  useEffect(() => {
    if (!showAuthModal) return
    const check = () => {
      if (checkAuthentication()) {
        setIsAuthenticated(true)
        setShowAuthModal(false)
      }
    }
    window.addEventListener('focus', check)
    document.addEventListener('visibilitychange', check)
    return () => {
      window.removeEventListener('focus', check)
      document.removeEventListener('visibilitychange', check)
    }
  }, [showAuthModal]) // Only active when modal is open

  return { isAuthenticated, isMounted, showAuthModal, setShowAuthModal }
}
