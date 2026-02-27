"use client"

import { FileEdit, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"

interface ServiceQuickActionsProps {
    serviceId: number
    customerPhone?: string
}

export function ServiceQuickActions({ serviceId, customerPhone }: ServiceQuickActionsProps) {
    const router = useRouter()
    const { dark } = useAdminTheme()

    const actions: { Icon: typeof FileEdit; label: string; onClick: () => void }[] = [
        {
            Icon: FileEdit,
            label: "Editar Nota de Costos",
            onClick: () => router.push(`/admin/servicios/nota/${serviceId}`),
        },
        ...(customerPhone
            ? [{
                Icon: Phone,
                label: "Llamar Cliente",
                onClick: () => window.open(`tel:${customerPhone}`, "_self"),
            }]
            : []),
    ]

    return (
        <div className={`rounded-xl border ${dark ? "border-white/10 bg-[#0F172A]" : "border-gray-200 bg-white"}`}>
            {/* Header */}
            <div className={`px-5 py-4 border-b ${dark ? "border-white/10" : "border-gray-100"}`}>
                <h2 className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-gray-400" : "text-gray-500"}`}>
                    Acciones
                </h2>
            </div>

            {/* Action list */}
            <div className="p-3 space-y-1">
                {actions.map(({ Icon, label, onClick }) => (
                    <button
                        key={label}
                        onClick={onClick}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors cursor-pointer ${
                            dark
                                ? "text-gray-300 hover:bg-white/10 hover:text-gray-100"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                        <Icon className={`w-4 h-4 shrink-0 ${dark ? "text-gray-500" : "text-gray-400"}`} />
                        <span className="flex-1">{label}</span>
                        <span className={`text-xs ${dark ? "text-gray-600" : "text-gray-400"}`}>→</span>
                    </button>
                ))}
            </div>
        </div>
    )
}
