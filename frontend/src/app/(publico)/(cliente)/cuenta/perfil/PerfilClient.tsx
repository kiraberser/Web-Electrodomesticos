"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import type { UserProfile } from "@/types/user"
import {
    ProfileHeader,
    ProfileInfo,
    ProfileActions,
    EditProfileModal,
} from "@/components/usuario"

interface PerfilClientProps {
    user: UserProfile
}

export function PerfilClient({ user }: PerfilClientProps) {
    const router = useRouter()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<UserProfile>(user)
    const lastUserUpdateRef = useRef<string>(JSON.stringify(user))

    // Sincronizar currentUser con user solo cuando realmente cambie (comparando JSON)
    // Esto evita re-renderizados innecesarios cuando el objeto user es nuevo pero tiene los mismos datos
    useEffect(() => {
        const currentUserJson = JSON.stringify(user)
        if (currentUserJson !== lastUserUpdateRef.current) {
            lastUserUpdateRef.current = currentUserJson
            setCurrentUser(user)
        }
    }, [user])

    const handleEditClick = useCallback(() => {
        setIsEditModalOpen(true)
    }, [])

    const handleEditSuccess = useCallback((updatedUser: UserProfile) => {
        // Actualizar el estado local inmediatamente con los datos actualizados del servidor
        setCurrentUser(updatedUser)
        lastUserUpdateRef.current = JSON.stringify(updatedUser)
        
        // Cerrar el modal
        setIsEditModalOpen(false)
        
        // NO hacer router.refresh() aquí porque causa loops de renderizado
        // Los datos ya están actualizados en currentUser desde el servidor (state.data)
        // El refresh solo es necesario si navegas fuera y vuelves a la página
    }, [])

    const handleLogout = () => {
        // TODO: Implementar logout
        console.log("Logout clicked")
        router.push("/cuenta")
    }

    const handleDeleteAccount = () => {
        // TODO: Implementar eliminación de cuenta con confirmación
        if (confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
            console.log("Delete account clicked")
            // Implementar llamada a API para eliminar cuenta
        }
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
                <div className="max-w-3xl mx-auto">
                    {/* Encabezado de la Página */}
                    <div className="mb-8 text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-[#0A3981]">
                            Mi Perfil
                        </h1>
                        <p className="mt-2 text-[#1F509A]">
                            Administra tu información personal y seguridad.
                        </p>
                    </div>

                    {/* Tarjeta Principal */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        <ProfileHeader user={currentUser} onEditClick={handleEditClick} />
                        <ProfileInfo user={currentUser} />
                        <ProfileActions
                            onLogout={handleLogout}
                            onDeleteAccount={handleDeleteAccount}
                        />
                    </div>
                </div>
            </div>

            {/* Modal de Edición */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={currentUser}
                onSuccess={handleEditSuccess}
            />
        </>
    )
}

