'use client'

import { useEffect } from 'react'
import { agregarFavoritoAction, eliminarFavoritoAction } from '@/actions/favoritos'
import { checkAuthentication } from '@/lib/cookies'

const STORAGE_KEY = 'pending_favorite_actions'

export default function FavoritosSync() {
    useEffect(() => {
        const syncPendingActions = async () => {
            // Verificar autenticación antes de sincronizar
            if (!checkAuthentication()) {
                // Limpiar storage si no está autenticado
                sessionStorage.removeItem(STORAGE_KEY)
                return
            }

            try {
                const stored = sessionStorage.getItem(STORAGE_KEY)
                if (!stored) return

                const actions: Array<{ action: 'add' | 'remove'; refaccionId: number }> = JSON.parse(stored)
                if (actions.length === 0) return

                // Limpiar storage inmediatamente para evitar duplicados
                sessionStorage.removeItem(STORAGE_KEY)

                // Ejecutar todas las acciones pendientes
                for (const { action, refaccionId } of actions) {
                    if (action === 'add') {
                        await agregarFavoritoAction(refaccionId)
                    } else {
                        await eliminarFavoritoAction(refaccionId)
                    }
                }
            } catch (error) {
                console.error('Error sincronizando favoritos:', error)
            }
        }

        // Sincronizar cuando se carga la página de favoritos
        syncPendingActions()
    }, [])

    return null // Este componente no renderiza nada
}

