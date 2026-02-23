"use client"

import { DollarSign } from "lucide-react"
import { Badge } from "@/shared/ui/feedback/Badge"
import type { ServiceDetail } from "@/shared/types/service"

interface ServiceCostInfoProps {
    service: Pick<ServiceDetail, "costoManoObra" | "costoRefacciones" | "estadoPago">
}

export function ServiceCostInfo({ service }: ServiceCostInfoProps) {
    const totalCost = (service.costoManoObra || 0) + (service.costoRefacciones || 0)

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Información de Costos
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mano de Obra</label>
                    <p className="text-gray-900 font-medium">${(service.costoManoObra || 0)}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Refacciones</label>
                    <p className="text-gray-900 font-medium">${(service.costoRefacciones || 0)}</p>
                </div>

                <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total</label>
                    <p className="text-2xl font-bold text-green-600">
                        ${totalCost.toString().split(".")[0] }
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado de Pago</label>
                    <Badge
                        className={
                            service.estadoPago === "Pagado"
                                ? "bg-green-100 text-green-800"
                                : service.estadoPago === "Parcial"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                        }
                    >
                        {service.estadoPago || "Pendiente"}
                    </Badge>
                </div>
            </div>
        </div>
    )
}
