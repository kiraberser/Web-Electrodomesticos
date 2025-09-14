"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createServiceSaleAction } from "@/actions/services"
import {
    NoteHeader,
    ServiceInfoCard,
    CostBreakdownCard,
    PartsSection,
    NotesSection,
    CostSummary,
    PaymentStatusCard,
    DeliveryInfoCard,
} from "@/components/features/notes"
import { CostNote } from "@/types/service"

const costNoteSchema = {
    safeParse: (data: any) => ({ success: true, error: { errors: [] } }),
}

export default function ServiceNoteClient({ serviceId, initialCostNote }: { serviceId: string; initialCostNote: CostNote }) {
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [costNote, setCostNote] = useState<CostNote>(initialCostNote)
    const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

    useEffect(() => {
        setCostNote(initialCostNote)
    }, [initialCostNote])

    // Calculate total cost when labor or parts cost changes
    useEffect(() => {
        const partsTotal = costNote.parts.reduce((sum, part) => sum + part.total, 0)
        const total = costNote.laborCost + partsTotal
        setCostNote((prev) => ({ ...prev, totalCost: total, partsCost: partsTotal }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [costNote.laborCost, costNote.parts])

    const addPart = () => {
        setCostNote((prev) => ({
            ...prev,
            parts: [...prev.parts, { name: "", quantity: 1, price: 0, total: 0 }],
        }))
    }

    const removePart = (index: number) => {
        setCostNote((prev) => ({
            ...prev,
            parts: prev.parts.filter((_, i) => i !== index),
        }))
    }

    const updatePart = (index: number, field: keyof CostNote["parts"][0], value: string | number) => {
        setCostNote((prev) => {
            const newParts = [...prev.parts]
            newParts[index] = { ...newParts[index], [field]: value }
            if (field === "quantity" || field === "price") {
                const quantity = field === "quantity" ? Number(value) : newParts[index].quantity
                const price = field === "price" ? Number(value) : newParts[index].price
                newParts[index].total = quantity * price
            }
            return { ...prev, parts: newParts }
        })
    }

    const validateForm = () => {
        const validation = costNoteSchema.safeParse(costNote)
        if (!validation.success) {
            const newErrors: Partial<Record<string, string>> = {}
            // Add mapping if schema exists
            setErrors(newErrors)
            return false
        }
        setErrors({})
        return true
    }

    const handleInputChange = (field: string, value: string | number) => {
        setCostNote((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    const handleSave = async () => {
        if (!validateForm()) return
        try {
            setSaving(true)
            const form = new FormData()
            form.append('servicio', String(serviceId))
            form.append('mano_obra', String(costNote.laborCost))
            form.append('refacciones_total', String(costNote.partsCost))
            form.append('total', String(costNote.totalCost))
            form.append('observaciones', costNote.notes || '')
            form.append('tecnico', costNote.technician || 'Jose')
            form.append('garantia_dias', String(costNote.warranty || 30))
            form.append('estado_pago', costNote.paymentStatus || 'Pendiente')
            form.append('parts', JSON.stringify(costNote.parts || []))

            const res = await createServiceSaleAction({ success: false, error: null }, form)
            if (res.success) router.push("/admin/servicios")
        } finally {
            setSaving(false)
        }
    }

    const handleNotesChange = (notes: string) => handleInputChange("notes", notes)
    const handlePaymentStatusChange = (status: string) => handleInputChange("paymentStatus", status)
    const handleTechnicianChange = (technician: string) => handleInputChange("technician", technician)
    const handleWarrantyChange = (warranty: number) => handleInputChange("warranty", warranty)

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando información del servicio...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <NoteHeader 
                costNote={costNote}
                saving={saving}
                onBack={() => router.back()}
                onSave={handleSave}
            />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <ServiceInfoCard 
                                costNote={costNote}
                                errors={errors}
                                onInputChange={handleInputChange}
                            />

                            <CostBreakdownCard 
                                costNote={costNote}
                                errors={errors}
                                onInputChange={handleInputChange}
                            >
                                <PartsSection 
                                    parts={costNote.parts}
                                    onAddPart={addPart}
                                    onRemovePart={removePart}
                                    onUpdatePart={updatePart}
                                />
                            </CostBreakdownCard>

                            <NotesSection 
                                notes={costNote.notes}
                                onNotesChange={handleNotesChange}
                            />
                        </div>

                        <div className="space-y-6">
                            <CostSummary 
                                totalCost={costNote.totalCost}
                                laborCost={costNote.laborCost}
                                partsCost={costNote.partsCost}
                            />

                            <PaymentStatusCard 
                                paymentStatus={costNote.paymentStatus || "Pendiente"}
                                onPaymentStatusChange={handlePaymentStatusChange}
                            />

                            <DeliveryInfoCard 
                                technician={costNote.technician || "Jose"}
                                warranty={costNote.warranty || 30}
                                onTechnicianChange={handleTechnicianChange}
                                onWarrantyChange={handleWarrantyChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


