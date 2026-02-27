"use client"

import { Receipt } from "lucide-react"
import type { ServiceDetail } from "@/shared/types/service"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"

interface ServiceCostInfoProps {
    service: Pick<ServiceDetail, "costoManoObra" | "costoRefacciones" | "costoTotal" | "estadoPago">
}

const fmt = (n: number) =>
    `$${n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const PAYMENT_COLORS: Record<string, { dark: string; light: string }> = {
    "Pagado":    { dark: "bg-emerald-900/20 text-emerald-300", light: "bg-emerald-100 text-emerald-800" },
    "Parcial":   { dark: "bg-amber-900/20 text-amber-300",     light: "bg-amber-100 text-amber-800"     },
    "Pendiente": { dark: "bg-red-900/20 text-red-300",          light: "bg-red-100 text-red-800"         },
}

export function ServiceCostInfo({ service }: ServiceCostInfoProps) {
    const { dark } = useAdminTheme()

    const labor  = service.costoManoObra     || 0
    const parts  = service.costoRefacciones  || 0
    const total  = service.costoTotal        || labor + parts
    const status = service.estadoPago        || "Pendiente"
    const payColor = PAYMENT_COLORS[status]  ?? PAYMENT_COLORS["Pendiente"]

    return (
        <div className={`rounded-xl border ${dark ? "border-white/10 bg-[#0F172A]" : "border-gray-200 bg-white"}`}>
            {/* Header */}
            <div className={`flex items-center gap-2 px-5 py-4 border-b ${dark ? "border-white/10" : "border-gray-100"}`}>
                <Receipt className={`w-4 h-4 ${dark ? "text-emerald-400" : "text-emerald-600"}`} />
                <h2 className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-gray-400" : "text-gray-500"}`}>
                    Costos
                </h2>
            </div>

            <div className="px-5 py-4 space-y-3">
                {/* Cost lines */}
                {[
                    { label: "Mano de obra", value: labor },
                    { label: "Refacciones",  value: parts },
                ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center">
                        <span className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>{label}</span>
                        <span className={`text-sm font-medium tabular-nums ${dark ? "text-gray-200" : "text-gray-700"}`}>
                            {fmt(value)}
                        </span>
                    </div>
                ))}

                {/* Total */}
                <div className={`border-t pt-3 ${dark ? "border-white/10" : "border-gray-100"}`}>
                    <div className="flex justify-between items-baseline">
                        <span className={`text-xs font-semibold uppercase tracking-wide ${dark ? "text-gray-500" : "text-gray-400"}`}>
                            Total
                        </span>
                        <span className={`text-2xl font-bold tabular-nums ${dark ? "text-emerald-400" : "text-emerald-600"}`}>
                            {fmt(total)}
                        </span>
                    </div>
                </div>

                {/* Payment status */}
                <div className={`flex justify-between items-center pt-1 border-t ${dark ? "border-white/5" : "border-gray-50"}`}>
                    <span className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>Estado de pago</span>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${dark ? payColor.dark : payColor.light}`}>
                        {status}
                    </span>
                </div>
            </div>
        </div>
    )
}
