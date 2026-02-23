"use client"

import type React from "react"
import { LogOut, Trash2, Lock } from "lucide-react"

interface ProfileActionsProps {
    onLogout: () => void
    onDeleteAccount: () => void
    onChangePassword?: () => void
}

export function ProfileActions({ onLogout, onDeleteAccount, onChangePassword }: ProfileActionsProps) {
    return (
        <div className="px-6 pb-8">
            {/* Sección de Seguridad */}
            {onChangePassword && (
                <div className="border-t border-gray-100 mt-6 pt-6">
                    <button
                        onClick={onChangePassword}
                        className="flex items-center gap-2 text-[#1F509A] hover:text-[#0A3981] font-medium transition-colors text-sm px-4 py-2 hover:bg-blue-50 rounded-lg cursor-pointer w-full sm:w-auto"
                    >
                        <Lock size={18} />
                        Cambiar Contraseña
                    </button>
                </div>
            )}

            {/* Zona de Peligro / Sesión */}
            <div className="border-t border-gray-100 mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 text-[#1F509A] hover:text-[#0A3981] font-medium transition-colors text-sm cursor-pointer"
                >
                    <LogOut size={18} />
                    Cerrar Sesión
                </button>

                <button
                    onClick={onDeleteAccount}
                    className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium transition-colors text-sm px-4 py-2 hover:bg-red-50 rounded-lg cursor-pointer"
                >
                    <Trash2 size={18} />
                    Eliminar Cuenta
                </button>
            </div>
        </div>
    )
}

