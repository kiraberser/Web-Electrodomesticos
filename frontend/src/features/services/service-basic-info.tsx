"use client"

import { Phone, Calendar, Package, User } from "lucide-react"
import { Badge } from "@/shared/ui/feedback/Badge"
import type { ServiceDetail } from "@/shared/types/service"

interface ServiceBasicInfoProps {
    service: Pick<ServiceDetail, "cliente" | "telefono" | "aparato" | "fecha" | "estado" | "prioridad">
}

export function ServiceBasicInfo({ service }: ServiceBasicInfoProps) {
    const getStatusBadge = (status: ServiceBasicInfoProps["service"]["estado"]) => {
        const statusConfig = {
            Pendiente: { color: "bg-yellow-100 text-yellow-800", icon: "⏳" },
            "En Proceso": { color: "bg-blue-100 text-blue-800", icon: "🔧" },
            Reparado: { color: "bg-green-100 text-green-800", icon: "✅" },
            Entregado: { color: "bg-purple-100 text-purple-800", icon: "📦" },
            Cancelado: { color: "bg-red-100 text-red-800", icon: "❌" },
        }

        const config = statusConfig[status]
        return (
            <Badge className={`${config.color} font-medium`}>
                <span className="mr-1">{config.icon}</span>
                {status}
            </Badge>
        )
    }

    const getPriorityBadge = (priority: ServiceBasicInfoProps["service"]["prioridad"]) => {
        if (!priority) return null

        const priorityConfig = {
            Baja: { color: "bg-gray-100 text-gray-800" },
            Media: { color: "bg-blue-100 text-blue-800" },
            Alta: { color: "bg-orange-100 text-orange-800" },
            Urgente: { color: "bg-red-100 text-red-800" },
        }

        const config = priorityConfig[priority]
        return <Badge className={`${config.color} font-medium`}>{priority}</Badge>
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-600" />
                Información del Servicio
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Cliente
                    </label>
                    <p className="text-gray-900 font-medium">{service.cliente}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Teléfono
                    </label>
                    <a
                        href={`tel:${service.telefono}`}
                        className="text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                        {service.telefono}
                    </a>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Package className="w-4 h-4 inline mr-2" />
                        Aparato
                    </label>
                    <p className="text-gray-900">{service.aparato}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Fecha de Ingreso
                    </label>
                    <p className="text-gray-900">{new Date(service.fecha).toLocaleDateString("es-ES")}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    {getStatusBadge(service.estado)}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                    {getPriorityBadge(service.prioridad)}
                </div>
            </div>
        </div>
    )
}
