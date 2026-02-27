"use client"

import { ArrowLeft, Clock, AlertCircle, CheckCircle, XCircle, FileEdit } from "lucide-react"
import { Button } from "@/shared/ui/forms/Button"
import type { ServiceDetail } from "@/shared/types/service"
import Link from "next/link"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"

interface ServiceHeaderProps {
    service: Pick<ServiceDetail, "noDeServicio" | "cliente" | "aparato" | "estado" | "prioridad">
    backHref?: string
}

const STATUS_CONFIG: Record<string, { Icon: typeof Clock; iconColor: string; bg: string }> = {
    "Pendiente":   { Icon: Clock,         iconColor: "text-amber-500",   bg: "bg-amber-500/10"   },
    "En Proceso":  { Icon: AlertCircle,   iconColor: "text-blue-500",    bg: "bg-blue-500/10"    },
    "Reparado":    { Icon: CheckCircle,   iconColor: "text-emerald-500", bg: "bg-emerald-500/10" },
    "Entregado":   { Icon: CheckCircle,   iconColor: "text-purple-500",  bg: "bg-purple-500/10"  },
    "Cancelado":   { Icon: XCircle,       iconColor: "text-red-500",     bg: "bg-red-500/10"     },
}

const ESTADO_COLORS: Record<string, { dark: string; light: string }> = {
    "Pendiente":   { dark: "bg-amber-900/20 text-amber-300",    light: "bg-amber-100 text-amber-800"   },
    "En Proceso":  { dark: "bg-blue-900/20 text-blue-300",      light: "bg-blue-100 text-blue-800"     },
    "Reparado":    { dark: "bg-emerald-900/20 text-emerald-300",light: "bg-emerald-100 text-emerald-800"},
    "Entregado":   { dark: "bg-purple-900/20 text-purple-300",  light: "bg-purple-100 text-purple-800" },
    "Cancelado":   { dark: "bg-red-900/20 text-red-300",        light: "bg-red-100 text-red-800"       },
}

const PRIORIDAD_COLORS: Record<string, { dark: string; light: string }> = {
    "Urgente": { dark: "bg-red-900/20 text-red-300",    light: "bg-red-100 text-red-700"    },
    "Alta":    { dark: "bg-orange-900/20 text-orange-300", light: "bg-orange-100 text-orange-700" },
    "Media":   { dark: "bg-blue-900/20 text-blue-300",  light: "bg-blue-100 text-blue-700"  },
    "Baja":    { dark: "bg-gray-800 text-gray-400",     light: "bg-gray-100 text-gray-600"  },
}

export function ServiceHeader({ service, backHref }: ServiceHeaderProps) {
    const { dark } = useAdminTheme()

    const cfg = STATUS_CONFIG[service.estado] ?? STATUS_CONFIG["Pendiente"]
    const { Icon } = cfg
    const estadoColor = ESTADO_COLORS[service.estado]
    const prioridadColor = service.prioridad ? PRIORIDAD_COLORS[service.prioridad] : null

    return (
        <div className={`border-b ${dark ? "border-white/10 bg-[#0F172A]" : "border-gray-200 bg-white"}`}>
            <div className="container mx-auto px-4 py-5">
                <div className="flex items-center justify-between gap-4">
                    {/* Left: back + identity */}
                    <div className="flex items-center gap-4 min-w-0">
                        {backHref && (
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className={`cursor-pointer shrink-0 ${dark ? "text-gray-400 hover:text-gray-200 hover:bg-white/10" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
                            >
                                <Link href={backHref}>
                                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                                    Servicios
                                </Link>
                            </Button>
                        )}

                        <div className={`w-px h-8 shrink-0 hidden sm:block ${dark ? "bg-white/10" : "bg-gray-200"}`} />

                        <div className="flex items-center gap-3 min-w-0">
                            <div className={`p-2.5 rounded-lg shrink-0 ${cfg.bg}`}>
                                <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className={`text-xl font-bold ${dark ? "text-gray-100" : "text-gray-900"}`}>
                                        Servicio #{service.noDeServicio}
                                    </h1>
                                    {estadoColor && (
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${dark ? estadoColor.dark : estadoColor.light}`}>
                                            {service.estado}
                                        </span>
                                    )}
                                    {prioridadColor && (
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${dark ? prioridadColor.dark : prioridadColor.light}`}>
                                            {service.prioridad}
                                        </span>
                                    )}
                                </div>
                                <p className={`text-sm mt-0.5 truncate ${dark ? "text-gray-400" : "text-gray-500"}`}>
                                    {service.cliente} — {service.aparato}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: primary action */}
                    <Link
                        href={`/admin/servicios/nota/${service.noDeServicio}`}
                        className={`shrink-0 flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                            dark
                                ? "text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20"
                                : "text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200"
                        }`}
                    >
                        <FileEdit className="w-4 h-4" />
                        <span className="hidden sm:inline">Nota de Costos</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
