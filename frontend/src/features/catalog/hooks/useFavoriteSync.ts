"use client"

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'
import { checkAuthentication } from '@/shared/lib/cookies'
import { agregarFavoritoAction, eliminarFavoritoAction } from '@/features/favorites/actions'

// Module-level helpers — hoisted outside component, never re-create (Vercel: rendering-hoist-jsx, js-cache-storage)
const STORAGE_KEY = 'pending_favorite_actions'
type PendingAction = { action: 'add' | 'remove'; refaccionId: number }

function getPendingActions(): PendingAction[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]') }
  catch { return [] }
}

function setPendingActions(actions: PendingAction[]) {
  if (typeof window === 'undefined') return
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(actions)) }
  catch { /* ignore storage errors */ }
}

export function useFavoriteSync(
  refaccionId: number,
  initialIsFavorite: boolean,
  onAuthRequired: () => void,
) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false)
  const isProcessingRef = useRef(false)   // Vercel: rerender-use-ref-transient-values
  const isSyncingRef = useRef(false)      // Vercel: rerender-use-ref-transient-values
  const syncFnRef = useRef(async () => {}) // useLatest pattern (Vercel: advanced-use-latest)
  const pathname = usePathname()

  // Sync pending queue to backend
  const syncPendingActions = async () => {
    if (!checkAuthentication()) { setPendingActions([]); return }
    const actions = getPendingActions()
    if (actions.length === 0 || isSyncingRef.current) return
    isSyncingRef.current = true
    setPendingActions([])
    try {
      for (const { action, refaccionId: rid } of actions) {
        if (action === 'add') await agregarFavoritoAction(rid)
        else await eliminarFavoritoAction(rid)
      }
    } catch {
      // Re-queue failed actions if still authenticated
      if (checkAuthentication()) setPendingActions([...actions, ...getPendingActions()])
    } finally {
      isSyncingRef.current = false
    }
  }

  // Keep ref current on every render so listeners always call the latest version (useLatest pattern)
  syncFnRef.current = syncPendingActions

  // Sync when navigating to favorites page
  useEffect(() => {
    if (pathname === '/cuenta/perfil/favoritos') syncFnRef.current()
  }, [pathname])

  // Single useEffect — registers ALL global listeners ONCE (Vercel: client-event-listeners)
  useEffect(() => {
    const handleHide = () => { if (document.hidden) syncFnRef.current() }
    const handleUnload = () => { if (getPendingActions().length) syncFnRef.current() }
    const handleFavClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a[href*="/cuenta/perfil/favoritos"]')) {
        syncFnRef.current()
      }
    }

    document.addEventListener('visibilitychange', handleHide)
    window.addEventListener('beforeunload', handleUnload)
    document.addEventListener('click', handleFavClick, true)

    return () => {
      document.removeEventListener('visibilitychange', handleHide)
      window.removeEventListener('beforeunload', handleUnload)
      document.removeEventListener('click', handleFavClick, true)
      // Sync any pending actions on unmount
      syncFnRef.current()
    }
  }, []) // [] — listeners registered ONCE, no stale closures via syncFnRef (Vercel: client-event-listeners)

  const toggleFavorite = () => {
    if (isProcessingRef.current || isFavoriteLoading) return
    if (!checkAuthentication()) { onAuthRequired(); return }
    if (!refaccionId) return

    isProcessingRef.current = true
    setIsFavoriteLoading(true)

    const previousState = isFavorite
    const newState = !previousState
    setIsFavorite(newState)

    // Optimize queue — cancel opposite consecutive actions to avoid redundant API calls
    const currentActions = getPendingActions()
    const lastAction = currentActions[currentActions.length - 1]
    let updatedActions: PendingAction[]

    if (lastAction && lastAction.refaccionId === refaccionId) {
      const isOpposite =
        (lastAction.action === 'add' && !newState) ||
        (lastAction.action === 'remove' && newState)
      if (isOpposite) {
        updatedActions = currentActions.slice(0, -1) // Cancel previous action
      } else {
        // Same action twice — revert optimistic update
        setIsFavorite(previousState)
        setIsFavoriteLoading(false)
        isProcessingRef.current = false
        return
      }
    } else {
      updatedActions = [...currentActions, { action: newState ? 'add' : 'remove', refaccionId }]
    }

    setPendingActions(updatedActions)

    toast.success(newState ? 'Agregado a favoritos' : 'Eliminado de favoritos', {
      icon: newState ? '❤️' : '💔',
      style: { background: '#0A3981', color: '#fff' },
      duration: 2000,
    })

    setTimeout(() => {
      setIsFavoriteLoading(false)
      isProcessingRef.current = false
    }, 300)
  }

  return { isFavorite, isFavoriteLoading, toggleFavorite }
}
