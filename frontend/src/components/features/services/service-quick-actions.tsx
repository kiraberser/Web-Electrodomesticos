"use client"

import { DollarSign, Phone, FileText } from "lucide-react"
import { Button } from "@/components/ui/forms/Button"
import { useRouter } from "next/navigation"

interface ServiceQuickActionsProps {
    serviceId: number
    customerPhone?: string
}

export function ServiceQuickActions({ 
    serviceId,
    customerPhone,
}: ServiceQuickActionsProps) {
    const router = useRouter()

    const goToCostNote = () => {
        router.push(`/admin/servicios/nota/${serviceId}`)
    }

    const callCustomer = () => {
        if (customerPhone) {
            window.open(`tel:${customerPhone}`, "_self")
        }
    }

    const generateReport = () => {
        // TODO: Implement report generation
        // eslint-disable-next-line no-console
        console.log("Generating report for service:", serviceId)
    }
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>

            <div className="space-y-3">
                <Button
                    onClick={goToCostNote}
                    variant="outline"
                    className="w-full justify-start cursor-pointer bg-transparent"
                >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Crear Nota de Costos
                </Button>

                <Button 
                    onClick={callCustomer}
                    variant="outline" 
                    className="w-full justify-start cursor-pointer bg-transparent"
                >
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar Cliente
                </Button>

                <Button 
                    onClick={generateReport}
                    variant="outline" 
                    className="w-full justify-start cursor-pointer bg-transparent"
                >
                    <FileText className="w-4 h-4 mr-2" />
                    Generar Reporte
                </Button>
            </div>
        </div>
    )
}
