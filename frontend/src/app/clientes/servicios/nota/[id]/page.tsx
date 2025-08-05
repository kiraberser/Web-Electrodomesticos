"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save, Calculator, Calendar, DollarSign, FileText, User, Package } from "lucide-react"
import { Button } from "@/components/ui/forms/Button"
import { Input } from "@/components/ui/forms/InputField"
import { Badge } from "@/components/ui"

interface CostNote {
    id?: number
    serviceNumber: number
    clientName: string
    deviceName: string
    laborCost: number
    partsCost: number
    totalCost: number
    deliveryDate: string
    notes: string
    createdAt: string
    updatedAt: string
}

export default function ServiceNotePage() {
    const params = useParams()
    const router = useRouter()
    const nota = params.nota as string

    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [costNote, setCostNote] = useState<CostNote>({
        serviceNumber: 0,
        clientName: "",
        deviceName: "",
        laborCost: 0,
        partsCost: 0,
        totalCost: 0,
        deliveryDate: "",
        notes: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    })

    const [errors, setErrors] = useState<Partial<Record<keyof CostNote, string>>>({})

    // Load existing note or initialize new one
    useEffect(() => {
        const loadCostNote = async () => {
            try {
                setLoading(true)

                // Try to parse nota as service number first
                const serviceNumber = Number.parseInt(nota)
                if (!isNaN(serviceNumber)) {
                    // Load by service number
                    // const response = await fetch(`/api/services/${serviceNumber}/cost-note`)
                    // const data = await response.json()

                    // Mock data for service
                    const mockServiceData = {
                        serviceNumber: serviceNumber,
                        clientName: "Edwin Martínez",
                        deviceName: "Licuadora Oster",
                        laborCost: 150,
                        partsCost: 85,
                        totalCost: 235,
                        deliveryDate: "2025-01-15",
                        notes: "Reparación de motor y cambio de cuchillas",
                        createdAt: "2025-01-08T10:00:00Z",
                        updatedAt: "2025-01-08T10:00:00Z",
                    }

                    setCostNote(mockServiceData)
                } else {
                    // Initialize for new note with client/service name
                    setCostNote((prev) => ({
                        ...prev,
                        clientName: decodeURIComponent(nota),
                        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
                    }))
                }
            } catch (error) {
                console.error("Error loading cost note:", error)
            } finally {
                setLoading(false)
            }
        }

        if (nota) {
            loadCostNote()
        }
    }, [nota])

    // Calculate total cost when labor or parts cost changes
    useEffect(() => {
        const total = costNote.laborCost + costNote.partsCost
        setCostNote((prev) => ({ ...prev, totalCost: total }))
    }, [costNote.laborCost, costNote.partsCost])

    const validateForm = () => {
        const newErrors: Partial<Record<keyof CostNote, string>> = {}

        if (!costNote.clientName.trim()) {
            newErrors.clientName = "El nombre del cliente es requerido"
        }

        if (!costNote.deviceName.trim()) {
            newErrors.deviceName = "El nombre del aparato es requerido"
        }

        if (costNote.laborCost < 0) {
            newErrors.laborCost = "El costo de mano de obra no puede ser negativo"
        }

        if (costNote.partsCost < 0) {
            newErrors.partsCost = "El costo de refacciones no puede ser negativo"
        }

        if (!costNote.deliveryDate) {
            newErrors.deliveryDate = "La fecha de entrega es requerida"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field: keyof CostNote, value: string | number) => {
        setCostNote((prev) => ({ ...prev, [field]: value }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    const handleSave = async () => {
        if (!validateForm()) return

        try {
            setSaving(true)

            // API call to save cost note
            // const response = await fetch('/api/cost-notes', {
            //   method: costNote.id ? 'PUT' : 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(costNote)
            // })

            // Mock save
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Redirect back to services list
            router.push("/clientes/servicios")
        } catch (error) {
            console.error("Error saving cost note:", error)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse space-y-4 w-full max-w-2xl mx-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="space-y-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" onClick={() => router.back()} className="cursor-pointer">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver
                            </Button>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{costNote.id ? "Editar" : "Nueva"} Nota de Costos</h1>
                                <p className="text-gray-600 mt-1">
                                    {costNote.serviceNumber ? `Servicio #${costNote.serviceNumber}` : "Crear nueva nota de costos"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {costNote.id && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                    Última actualización: {new Date(costNote.updatedAt).toLocaleDateString("es-ES")}
                                </Badge>
                            )}

                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? "Guardando..." : "Guardar"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        {/* Service Information */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Package className="w-5 h-5 mr-2 text-blue-600" />
                                Información del Servicio
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 inline mr-2" />
                                        Cliente *
                                    </label>
                                    <Input
                                        type="text"
                                        value={costNote.clientName}
                                        onChange={(e) => handleInputChange("clientName", e.target.value)}
                                        placeholder="Nombre del cliente"
                                        className={errors.clientName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                                    />
                                    {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Package className="w-4 h-4 inline mr-2" />
                                        Aparato *
                                    </label>
                                    <Input
                                        type="text"
                                        value={costNote.deviceName}
                                        onChange={(e) => handleInputChange("deviceName", e.target.value)}
                                        placeholder="Tipo de aparato"
                                        className={errors.deviceName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                                    />
                                    {errors.deviceName && <p className="text-red-500 text-sm mt-1">{errors.deviceName}</p>}
                                </div>

                                {costNote.serviceNumber > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Número de Servicio</label>
                                        <Input
                                            type="number"
                                            value={costNote.serviceNumber}
                                            onChange={(e) => handleInputChange("serviceNumber", Number.parseInt(e.target.value) || 0)}
                                            placeholder="0"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Fecha de Entrega *
                                    </label>
                                    <Input
                                        type="date"
                                        value={costNote.deliveryDate}
                                        onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
                                        className={errors.deliveryDate ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                                    />
                                    {errors.deliveryDate && <p className="text-red-500 text-sm mt-1">{errors.deliveryDate}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Cost Breakdown */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Calculator className="w-5 h-5 mr-2 text-green-600" />
                                Desglose de Costos
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <DollarSign className="w-4 h-4 inline mr-2" />
                                        Mano de Obra
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={costNote.laborCost}
                                        onChange={(e) => handleInputChange("laborCost", Number.parseFloat(e.target.value) || 0)}
                                        placeholder="0.00"
                                        className={errors.laborCost ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                                    />
                                    {errors.laborCost && <p className="text-red-500 text-sm mt-1">{errors.laborCost}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Package className="w-4 h-4 inline mr-2" />
                                        Refacciones
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={costNote.partsCost}
                                        onChange={(e) => handleInputChange("partsCost", Number.parseFloat(e.target.value) || 0)}
                                        placeholder="0.00"
                                        className={errors.partsCost ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                                    />
                                    {errors.partsCost && <p className="text-red-500 text-sm mt-1">{errors.partsCost}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Total</label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            value={costNote.totalCost}
                                            readOnly
                                            className="bg-gray-50 font-semibold text-lg"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 text-sm">$</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cost Summary Card */}
                            <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Total a Cobrar</h3>
                                        <p className="text-sm text-gray-600">Mano de obra + Refacciones</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-green-600">${costNote.totalCost.toFixed(2)}</div>
                                        <div className="text-sm text-gray-500">MXN</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                                Notas y Observaciones
                            </h2>

                            <textarea
                                value={costNote.notes}
                                onChange={(e) => handleInputChange("notes", e.target.value)}
                                placeholder="Describe los trabajos realizados, refacciones utilizadas, observaciones importantes..."
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                            <Button variant="outline" onClick={() => router.back()} className="cursor-pointer bg-transparent">
                                Cancelar
                            </Button>

                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? "Guardando..." : costNote.id ? "Actualizar" : "Guardar"} Nota
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
