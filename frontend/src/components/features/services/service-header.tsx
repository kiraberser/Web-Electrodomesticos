"use client"

import { ArrowLeft, Package, Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/forms/Button"
import type { ServiceDetail } from "@/types/service"
import Link from "next/link"

interface ServiceHeaderProps {
    service: Pick<ServiceDetail, "noDeServicio" | "cliente" | "aparato" | "estado">
    backHref?: string
}

export function ServiceHeader({ service, backHref }: ServiceHeaderProps) {
    const getStatusIcon = (status: ServiceHeaderProps["service"]["estado"]) => {
        const statusConfig = {
            Pendiente: { icon: Clock, color: "text-yellow-600" },
            "En Proceso": { icon: AlertCircle, color: "text-blue-600" },
            Reparado: { icon: CheckCircle, color: "text-green-600" },
            Entregado: { icon: CheckCircle, color: "text-purple-600" },
            Cancelado: { icon: XCircle, color: "text-red-600" },
        }

        const config = statusConfig[status]
        const IconComponent = config.icon

        return <IconComponent className={`w-5 h-5 ${config.color}`} />
    }

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {backHref && (
                            <Button asChild variant="ghost" className="cursor-pointer">
                                <Link href={backHref}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Volver
                                </Link>
                            </Button>
                        )}

                        <div className="flex items-center space-x-3">
                            {getStatusIcon(service.estado)}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Servicio #{service.noDeServicio}</h1>
                                <p className="text-gray-600 mt-1">
                                    {service.cliente} - {service.aparato}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
