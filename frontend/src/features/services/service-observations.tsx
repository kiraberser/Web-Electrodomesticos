"use client"

import { MessageSquare } from "lucide-react"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"

interface ServiceObservationsProps {
    observations: string
}

export function ServiceObservations({ observations }: ServiceObservationsProps) {
    const { dark } = useAdminTheme()
    const hasContent = observations && observations.trim().length > 0

    return (
        <div className={`rounded-xl border ${dark ? "border-white/10 bg-[#0F172A]" : "border-gray-200 bg-white"}`}>
            {/* Header */}
            <div className={`flex items-center gap-2 px-5 py-4 border-b ${dark ? "border-white/10" : "border-gray-100"}`}>
                <MessageSquare className={`w-4 h-4 ${dark ? "text-gray-500" : "text-gray-400"}`} />
                <h2 className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-gray-400" : "text-gray-500"}`}>
                    Observaciones
                </h2>
            </div>

            {/* Content */}
            <div className="px-5 py-4">
                {hasContent ? (
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${dark ? "text-gray-300" : "text-gray-700"}`}>
                        {observations}
                    </p>
                ) : (
                    <p className={`text-sm italic ${dark ? "text-gray-600" : "text-gray-400"}`}>
                        Sin observaciones registradas.
                    </p>
                )}
            </div>
        </div>
    )
}
