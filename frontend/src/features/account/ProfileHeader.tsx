"use client"

import type React from "react"
import { Edit3 } from "lucide-react"
import type { UserProfile } from "@/shared/types/user"

interface ProfileHeaderProps {
    user: UserProfile
    onEditClick: () => void
}

export function ProfileHeader({ user, onEditClick }: ProfileHeaderProps) {
    // Obtener iniciales para el avatar si no hay imagen
    const getInitials = () => {
        if (user.first_name && user.last_name) {
            return `${user.first_name[0]}${user.last_name[0]}`
        }
        return user.username.slice(0, 2).toUpperCase()
    }

    return (
        <>
            {/* Banner Superior - Celeste Claro */}
            <div className="h-32 bg-[#D4EBF8] w-full relative"></div>

            {/* Contenido del Perfil */}
            <div className="px-6 pb-8">
                {/* Sección de Avatar y Acciones Superiores */}
                <div className="relative flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-6 gap-4">
                    {/* Avatar Circle */}
                    <div className="relative">
                        <div className="h-24 w-24 rounded-full border-4 border-white bg-[#0A3981] flex items-center justify-center text-white text-2xl font-bold shadow-md">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt="Avatar"
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                <span>{getInitials()}</span>
                            )}
                        </div>
                    </div>

                    {/* Nombre y Rol */}
                    <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0">
                        <h2 className="text-2xl font-bold text-[#0A3981]">
                            {user.first_name
                                ? `${user.first_name} ${user.last_name}`
                                : user.username}
                        </h2>
                        <p className="text-gray-500 text-sm">@{user.username}</p>
                    </div>

                    {/* Botón Principal - Naranja */}
                    <button
                        onClick={onEditClick}
                        className="flex items-center gap-2 bg-[#E38E49] hover:bg-[#d68340] text-white px-6 py-2 rounded-full font-medium transition-colors shadow-sm active:scale-95 transform duration-150 cursor-pointer"
                    >
                        <Edit3 size={18} />
                        <span>Editar Perfil</span>
                    </button>
                </div>
            </div>
        </>
    )
}

