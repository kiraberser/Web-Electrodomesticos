import { getServiceById } from "@/features/services/api"
import ServiceNoteClient from "./ServiceNoteClient"
import { CostNote } from "@/shared/types/service"

export const revalidate = 60

export default async function ServiceNotePage({ params }: { params: Promise<{ id: string }> }) {
    const p = await params
    const response = await getServiceById(p.id)
    const service = response.data

    const note = service?.nota || {}
    const labor = (note.laborCost ?? service.costoManoObra ?? 0) as number
    const parts = (note.partsCost ?? service.costoRefacciones ?? 0) as number

    const initialCostNote: CostNote = {
        serviceNumber: service.noDeServicio,
        clientName: service.cliente,
        deviceName: service.aparato,
        laborCost: labor,
        partsCost: parts,
        totalCost: (note.totalCost ?? (labor + parts)) as number,
        deliveryDate: service.fechaEntrega || new Date().toISOString().split("T")[0],
        notes: (note.notes ?? service.observaciones ?? "") as string,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parts: (note.parts ?? service.refacciones ?? []) as { name: string; quantity: number; price: number; total: number }[],
        paymentStatus: (note.paymentStatus ?? "Pendiente") as string,
        technician: (note.technician ?? "Alfredo") as string,
        warranty: (note.warranty ?? 30) as number,
    }

    return <ServiceNoteClient serviceId={p.id} initialCostNote={initialCostNote} />
}
