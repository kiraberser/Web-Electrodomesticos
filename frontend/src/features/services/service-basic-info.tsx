"use client"

import { Phone, Calendar, Tv2, User, Tag, ShieldAlert } from "lucide-react"
import type { ServiceDetail } from "@/shared/types/service"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"

interface ServiceBasicInfoProps {
    service: Pick<ServiceDetail, "cliente" | "telefono" | "aparato" | "fecha" | "estado" | "prioridad" | "marca">
}

const formatPhone = (phone: string) =>
    phone.length === 10
        ? `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`
        : phone

const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })

const ESTADO_COLORS: Record<string, { dark: string; light: string }> = {
    "Pendiente":   { dark: "bg-amber-900/20 text-amber-300",    light: "bg-amber-100 text-amber-800"    },
    "En Proceso":  { dark: "bg-blue-900/20 text-blue-300",      light: "bg-blue-100 text-blue-800"      },
    "Reparado":    { dark: "bg-emerald-900/20 text-emerald-300",light: "bg-emerald-100 text-emerald-800" },
    "Entregado":   { dark: "bg-purple-900/20 text-purple-300",  light: "bg-purple-100 text-purple-800"  },
    "Cancelado":   { dark: "bg-red-900/20 text-red-300",        light: "bg-red-100 text-red-800"        },
}

export function ServiceBasicInfo({ service }: ServiceBasicInfoProps) {
    const { dark } = useAdminTheme()

    const estadoColor = ESTADO_COLORS[service.estado]
    const labelCls = `text-xs ${dark ? "text-gray-500" : "text-gray-400"} w-28 shrink-0`
    const valueCls = `text-sm flex-1 ${dark ? "text-gray-200" : "text-gray-800"}`
    const iconCls  = `w-4 h-4 shrink-0 ${dark ? "text-gray-600" : "text-gray-400"}`

    return (
        <div className={`rounded-xl border ${dark ? "border-white/10 bg-[#0F172A]" : "border-gray-200 bg-white"}`}>
            {/* Section header */}
            <div className={`px-5 py-4 border-b ${dark ? "border-white/10" : "border-gray-100"}`}>
                <h2 className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-gray-400" : "text-gray-500"}`}>
                    Información del Servicio
                </h2>
            </div>

            {/* Field rows */}
            <div className={dark ? "divide-y divide-white/5" : "divide-y divide-gray-100"}>
                {/* Cliente */}
                <div className="flex items-center gap-4 px-5 py-3.5">
                    <User className={iconCls} />
                    <span className={labelCls}>Cliente</span>
                    <span className={`${valueCls} font-medium ${dark ? "text-gray-100" : "text-gray-900"}`}>
                        {service.cliente}
                    </span>
                </div>

                {/* Teléfono */}
                <div className="flex items-center gap-4 px-5 py-3.5">
                    <Phone className={iconCls} />
                    <span className={labelCls}>Teléfono</span>
                    <a
                        href={`tel:${service.telefono}`}
                        className={`text-sm font-medium flex-1 ${dark ? "text-blue-300 hover:text-blue-200" : "text-blue-600 hover:text-blue-700"}`}
                    >
                        {formatPhone(service.telefono)}
                    </a>
                </div>

                {/* Aparato */}
                <div className="flex items-center gap-4 px-5 py-3.5">
                    <Tv2 className={iconCls} />
                    <span className={labelCls}>Aparato</span>
                    <span className={valueCls}>{service.aparato}</span>
                </div>

                {/* Marca */}
                {service.marca && (
                    <div className="flex items-center gap-4 px-5 py-3.5">
                        <Tag className={iconCls} />
                        <span className={labelCls}>Marca</span>
                        <span className={valueCls}>{service.marca}</span>
                    </div>
                )}

                {/* Fecha ingreso */}
                <div className="flex items-center gap-4 px-5 py-3.5">
                    <Calendar className={iconCls} />
                    <span className={labelCls}>Fecha de ingreso</span>
                    <span className={valueCls}>{formatDate(service.fecha)}</span>
                </div>

                {/* Estado */}
                <div className="flex items-center gap-4 px-5 py-3.5">
                    <ShieldAlert className={iconCls} />
                    <span className={labelCls}>Estado</span>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${estadoColor ? (dark ? estadoColor.dark : estadoColor.light) : ""}`}>
                        {service.estado}
                    </span>
                </div>

                {/* Prioridad */}
                {service.prioridad && (
                    <div className="flex items-center gap-4 px-5 py-3.5">
                        <div className={`w-4 h-4 shrink-0 ${iconCls}`} />
                        <span className={labelCls}>Prioridad</span>
                        <span className={`text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}>
                            {service.prioridad}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
