"use client"

import type React from "react"
import { LogOut, Trash2 } from "lucide-react"

interface ProfileActionsProps {
    onLogout: () => void
    onDeleteAccount: () => void
}

export function ProfileActions({ onLogout, onDeleteAccount }: ProfileActionsProps) {
    return (
        <div className="px-6 pb-8">
            {/* Zona de Peligro / Sesión */}
            <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
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

