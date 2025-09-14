import { Package } from "lucide-react"
import { Button } from "@/components/ui/forms/Button"
import Link from "next/link"
import {
    ServiceHeader,
    ServiceBasicInfo,
    ServiceObservations,
    ServiceCostInfo,
    ServiceDeliveryInfo,
    ServiceQuickActions,
} from "@/components/features/services"

import { ServiceDetail } from "@/types/service"

export default function ServiceDetailClient({ service }: { service: ServiceDetail | null }) {

    if (!service) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Servicio no encontrado</h3>
                    <p className="text-gray-500 mb-4">El servicio no existe o ha sido eliminado.</p>
                    <Button asChild className="cursor-pointer">
                        <Link href="/admin/servicios">Volver a Servicios</Link>
                    </Button>
                </div>
            </div>
        )
    }

    // Client actions moved into ServiceQuickActions (client component)

    return (
        <div className="min-h-screen bg-gray-50">
            <ServiceHeader service={service} backHref="/admin/servicios" />

            <div className="container mx-auto px-4 py-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <ServiceBasicInfo service={service} />
                        <ServiceObservations observations={service.observaciones} />
                    </div>

                    <div className="space-y-6">
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
    )
}


