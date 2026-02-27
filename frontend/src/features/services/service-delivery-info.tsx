"use client"

import { Wrench, ShieldCheck, CalendarCheck } from "lucide-react"
import type { ServiceDetail } from "@/shared/types/service"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"

interface ServiceDeliveryInfoProps {
    service: Pick<ServiceDetail, "fechaEntrega" | "tecnico" | "garantia">
}

const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })

export function ServiceDeliveryInfo({ service }: ServiceDeliveryInfoProps) {
    const { dark } = useAdminTheme()

    const rows = [
        {
            Icon: Wrench,
            label: "Técnico",
            value: service.tecnico || null,
            fallback: "Sin asignar",
        },
        {
            Icon: ShieldCheck,
            label: "Garantía",
            value: service.garantia ? `${service.garantia} días` : "30 días",
            fallback: null,
        },
        {
            Icon: CalendarCheck,
            label: "Fecha de entrega",
            value: service.fechaEntrega ? formatDate(service.fechaEntrega) : null,
            fallback: "Por definir",
        },
    ]

    return (
        <div className={`rounded-xl border ${dark ? "border-white/10 bg-[#0F172A]" : "border-gray-200 bg-white"}`}>
            {/* Header */}
            <div className={`px-5 py-4 border-b ${dark ? "border-white/10" : "border-gray-100"}`}>
                <h2 className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-gray-400" : "text-gray-500"}`}>
                    Entrega & Técnico
                </h2>
            </div>

            {/* Rows */}
            <div className={dark ? "divide-y divide-white/5" : "divide-y divide-gray-100"}>
                {rows.map(({ Icon, label, value, fallback }) => (
                    <div key={label} className="flex items-center gap-4 px-5 py-3.5">
                        <Icon className={`w-4 h-4 shrink-0 ${dark ? "text-gray-600" : "text-gray-400"}`} />
                        <span className={`text-xs w-28 shrink-0 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                            {label}
                        </span>
                        <span className={`text-sm flex-1 ${
                            value
                                ? dark ? "text-gray-200" : "text-gray-800"
                                : dark ? "text-gray-600 italic" : "text-gray-400 italic"
                        }`}>
                            {value ?? fallback}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
