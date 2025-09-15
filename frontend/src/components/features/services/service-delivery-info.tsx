"use client"

import { Calendar } from "lucide-react"
import type { ServiceDetail } from "@/types/service"

interface ServiceDeliveryInfoProps {
    service: Pick<ServiceDetail, "fechaEntrega" | "tecnico" | "garantia">
}

export function ServiceDeliveryInfo({ service }: ServiceDeliveryInfoProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                Información de Entrega
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Entrega</label>
                    <p className="text-gray-900">
                        {service.fechaEntrega
                            ? new Date(service.fechaEntrega).toLocaleDateString("es-ES")
                            : "No definida"}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Técnico Asignado</label>
                    <p className="text-gray-900">{service.tecnico || "No asignado"}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Garantía (días)</label>
                    <p className="text-gray-900">{service.garantia || 30} días</p>
                </div>
            </div>
        </div>
    )
}
