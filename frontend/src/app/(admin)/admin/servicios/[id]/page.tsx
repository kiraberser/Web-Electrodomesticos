import { getServiceById } from "@/features/services/api"
import ServiceDetailClient from "./ServiceDetailClient"

import { ServiceDetail } from "@/shared/types/service"

export const revalidate = 60

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const p = await params
    const response = await getServiceById(p.id)
    const srv = response.data
    const nota = srv?.nota
    const enriched: ServiceDetail | null = srv ? {
        ...srv,
        costoManoObra: nota?.laborCost ?? srv.costoManoObra,
        costoRefacciones: nota?.partsCost ?? srv.costoRefacciones,
        estadoPago: nota?.paymentStatus ?? srv.estadoPago,
        tecnico: nota?.technician ?? srv.tecnico,
        garantia: nota?.warranty ?? srv.garantia,
        observaciones: nota?.notes ?? srv.observaciones,
    } : null

    return <ServiceDetailClient service={enriched} />
}
