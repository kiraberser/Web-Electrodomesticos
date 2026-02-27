"use client"

import { Fragment } from "react"
import { Package } from "lucide-react"
import { Button } from "@/shared/ui/forms/Button"
import Link from "next/link"
import { ServiceHeader } from "@/features/services/service-header"
import { ServiceBasicInfo } from "@/features/services/service-basic-info"
import { ServiceObservations } from "@/features/services/service-observations"
import { ServiceCostInfo } from "@/features/services/service-cost-info"
import { ServiceDeliveryInfo } from "@/features/services/service-delivery-info"
import { ServiceQuickActions } from "@/features/services/service-quick-actions"
import type { ServiceDetail } from "@/shared/types/service"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"

const ESTADOS_TIMELINE = ["Pendiente", "En Proceso", "Reparado", "Entregado"] as const
type EstadoTimeline = typeof ESTADOS_TIMELINE[number]

function StatusTimeline({ estado, dark }: { estado: string; dark: boolean }) {
    if (estado === "Cancelado") {
        return (
            <div className={`rounded-xl border-l-4 border-red-500 px-5 py-3.5 ${dark ? "bg-red-900/10 border border-red-500/20" : "bg-red-50 border border-red-100"}`}>
                <p className={`text-sm font-medium ${dark ? "text-red-400" : "text-red-700"}`}>
                    Servicio cancelado — no hay progreso de reparación
                </p>
            </div>
        )
    }

    const currentIndex = ESTADOS_TIMELINE.indexOf(estado as EstadoTimeline)

    return (
        <div className={`rounded-xl border px-6 py-4 ${dark ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"}`}>
            <div className="flex items-center">
                {ESTADOS_TIMELINE.map((step, idx) => {
                    const isCompleted = idx < currentIndex
                    const isCurrent = idx === currentIndex

                    return (
                        <Fragment key={step}>
                            <div className="flex flex-col items-center gap-1.5">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                                    isCompleted
                                        ? "bg-emerald-500 border-emerald-500 text-white"
                                        : isCurrent
                                            ? "bg-blue-500 border-blue-500 text-white"
                                            : dark
                                                ? "bg-transparent border-white/20 text-gray-600"
                                                : "bg-white border-gray-300 text-gray-400"
                                }`}>
                                    {isCompleted ? "✓" : idx + 1}
                                </div>
                                <span className={`text-xs whitespace-nowrap font-medium ${
                                    isCurrent
                                        ? dark ? "text-blue-300" : "text-blue-600"
                                        : isCompleted
                                            ? dark ? "text-emerald-400" : "text-emerald-600"
                                            : dark ? "text-gray-600" : "text-gray-400"
                                }`}>
                                    {step}
                                </span>
                            </div>
                            {idx < ESTADOS_TIMELINE.length - 1 && (
                                <div className={`flex-1 h-0.5 mb-5 mx-2 ${
                                    idx < currentIndex
                                        ? "bg-emerald-500"
                                        : dark ? "bg-white/10" : "bg-gray-200"
                                }`} />
                            )}
                        </Fragment>
                    )
                })}
            </div>
        </div>
    )
}

export default function ServiceDetailClient({ service }: { service: ServiceDetail | null }) {
    const { dark } = useAdminTheme()

    if (!service) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${dark ? "bg-[#0F172A]" : "bg-gray-50"}`}>
                <div className="text-center">
                    <Package className={`w-12 h-12 mx-auto mb-4 ${dark ? "text-gray-600" : "text-gray-400"}`} />
                    <h3 className={`text-lg font-semibold mb-2 ${dark ? "text-gray-100" : "text-gray-900"}`}>
                        Servicio no encontrado
                    </h3>
                    <p className={`text-sm mb-5 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                        El servicio no existe o ha sido eliminado.
                    </p>
                    <Button asChild className="cursor-pointer">
                        <Link href="/admin/servicios">Volver a Servicios</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen ${dark ? "bg-[#0F172A]" : "bg-gray-50"}`}>
            <ServiceHeader service={service} backHref="/admin/servicios" />

            <div className="container mx-auto px-4 py-6">
                <div className="max-w-6xl mx-auto space-y-5">
                    {/* Status timeline */}
                    <StatusTimeline estado={service.estado} dark={dark} />

                    {/* Main content grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="lg:col-span-2 space-y-5">
                            <ServiceBasicInfo service={service} />
                            <ServiceObservations observations={service.observaciones} />
                        </div>

                        <div className="space-y-5">
                            <ServiceCostInfo service={service} />
                            <ServiceDeliveryInfo service={service} />
                            <ServiceQuickActions
                                serviceId={service.noDeServicio}
                                customerPhone={service.telefono}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
