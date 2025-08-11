"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    ArrowLeft,
    Edit,
    Save,
    Phone,
    Calendar,
    Package,
    User,
    FileText,
    DollarSign,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/forms/Button"
import { Input } from "@/components/ui/forms/InputField"
import { Badge } from "@/components/ui"

interface ServiceDetail {
    noDeServicio: number
    fecha: string
    aparato: string
    telefono: string
    cliente: string
    observaciones: string
    estado: "Pendiente" | "En Proceso" | "Reparado" | "Entregado" | "Cancelado"
    marca: number
    // Additional details
    fechaEntrega?: string
    costoManoObra?: number
    costoRefacciones?: number
    costoTotal?: number
    tecnico?: string
    prioridad?: "Baja" | "Media" | "Alta" | "Urgente"
    garantia?: number // days
    metodoPago?: string
    estadoPago?: "Pendiente" | "Pagado" | "Parcial"
}

export default function ServiceDetailPage() {
    const params = useParams()
    const router = useRouter()
    const serviceId = Number.parseInt(params.id as string)

    const [service, setService] = useState<ServiceDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [editedService, setEditedService] = useState<ServiceDetail | null>(null)

    // Load service details
    useEffect(() => {
        const loadServiceDetail = async () => {
            try {
                setLoading(true)

                // Mock data - replace with actual API call
                // const response = await fetch(`/api/services/${serviceId}`)
                // const data = await response.json()

                const mockServiceDetail: ServiceDetail = {
                    noDeServicio: serviceId,
                    fecha: "2025-01-01",
                    aparato: "Licuadora Oster",
                    telefono: "2321479161",
                    cliente: "Edwin Martínez",
                    observaciones: "Motor no funciona, hace ruido extraño al encender",
                    estado: "En Proceso",
                    marca: 1,
                    fechaEntrega: "2025-01-15",
                    costoManoObra: 150,
                    costoRefacciones: 85,
                    costoTotal: 235,
                    tecnico: "Juan Pérez",
                    prioridad: "Media",
                    garantia: 30,
                    metodoPago: "Efectivo",
                    estadoPago: "Pendiente",
                }

                setService(mockServiceDetail)
                setEditedService(mockServiceDetail)
            } catch (error) {
                console.error("Error loading service detail:", error)
            } finally {
                setLoading(false)
            }
        }

        if (serviceId) {
            loadServiceDetail()
        }
    }, [serviceId])

    const handleEdit = () => {
        setEditing(true)
        setEditedService({ ...service! })
    }

    const handleCancel = () => {
        setEditing(false)
        setEditedService({ ...service! })
    }

    const handleSave = async () => {
        if (!editedService) return

        try {
            setSaving(true)

            // API call to update service
            // const response = await fetch(`/api/services/${serviceId}`, {
            //   method: 'PUT',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(editedService)
            // })

            // Mock save
            await new Promise((resolve) => setTimeout(resolve, 1000))

            setService(editedService)
            setEditing(false)
        } catch (error) {
            console.error("Error saving service:", error)
        } finally {
            setSaving(false)
        }
    }

    const handleInputChange = (field: keyof ServiceDetail, value: string | number) => {
        if (!editedService) return

        setEditedService((prev) => ({ ...prev!, [field]: value }))
    }

    const getStatusIcon = (status: ServiceDetail["estado"]) => {
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

    const getStatusBadge = (status: ServiceDetail["estado"]) => {
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

    const getPriorityBadge = (priority: ServiceDetail["prioridad"]) => {
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse space-y-4 w-full max-w-4xl mx-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (!service) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Servicio no encontrado</h3>
                    <p className="text-gray-500 mb-4">El servicio #{serviceId} no existe o ha sido eliminado.</p>
                    <Button onClick={() => router.push("/clientes/servicios")} className="cursor-pointer">
                        Volver a Servicios
                    </Button>
                </div>
            </div>
        )
    }

    const currentService = editing ? editedService! : service

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

                            <div className="flex items-center space-x-3">
                                {getStatusIcon(currentService.estado)}
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Servicio #{currentService.noDeServicio}</h1>
                                    <p className="text-gray-600 mt-1">
                                        {currentService.cliente} - {currentService.aparato}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {getStatusBadge(currentService.estado)}
                            {currentService.prioridad && getPriorityBadge(currentService.prioridad)}

                            {editing ? (
                                <div className="flex space-x-2">
                                    <Button variant="outline" onClick={handleCancel} className="cursor-pointer bg-transparent">
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {saving ? "Guardando..." : "Guardar"}
                                    </Button>
                                </div>
                            ) : (
                                <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Service Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
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
                                    {editing ? (
                                        <Input
                                            type="text"
                                            value={currentService.cliente}
                                            onChange={(e) => handleInputChange("cliente", e.target.value)}
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium">{currentService.cliente}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="w-4 h-4 inline mr-2" />
                                        Teléfono
                                    </label>
                                    {editing ? (
                                        <Input
                                            type="tel"
                                            value={currentService.telefono}
                                            onChange={(e) => handleInputChange("telefono", e.target.value)}
                                        />
                                    ) : (
                                        <a
                                            href={`tel:${currentService.telefono}`}
                                            className="text-blue-600 hover:text-blue-700 cursor-pointer"
                                        >
                                            {currentService.telefono}
                                        </a>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Package className="w-4 h-4 inline mr-2" />
                                        Aparato
                                    </label>
                                    {editing ? (
                                        <Input
                                            type="text"
                                            value={currentService.aparato}
                                            onChange={(e) => handleInputChange("aparato", e.target.value)}
                                        />
                                    ) : (
                                        <p className="text-gray-900">{currentService.aparato}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Fecha de Ingreso
                                    </label>
                                    {editing ? (
                                        <Input
                                            type="date"
                                            value={currentService.fecha}
                                            onChange={(e) => handleInputChange("fecha", e.target.value)}
                                        />
                                    ) : (
                                        <p className="text-gray-900">{new Date(currentService.fecha).toLocaleDateString("es-ES")}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                    {editing ? (
                                        <select
                                            value={currentService.estado}
                                            onChange={(e) => handleInputChange("estado", e.target.value as ServiceDetail["estado"])}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="En Proceso">En Proceso</option>
                                            <option value="Reparado">Reparado</option>
                                            <option value="Entregado">Entregado</option>
                                            <option value="Cancelado">Cancelado</option>
                                        </select>
                                    ) : (
                                        getStatusBadge(currentService.estado)
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                                    {editing ? (
                                        <select
                                            value={currentService.prioridad || "Media"}
                                            onChange={(e) => handleInputChange("prioridad", e.target.value as ServiceDetail["prioridad"])}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Baja">Baja</option>
                                            <option value="Media">Media</option>
                                            <option value="Alta">Alta</option>
                                            <option value="Urgente">Urgente</option>
                                        </select>
                                    ) : (
                                        getPriorityBadge(currentService.prioridad)
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Observations */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                                Observaciones y Diagnóstico
                            </h2>

                            {editing ? (
                                <textarea
                                    value={currentService.observaciones}
                                    onChange={(e) => handleInputChange("observaciones", e.target.value)}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    placeholder="Describe el problema, diagnóstico y trabajos realizados..."
                                />
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {currentService.observaciones || "Sin observaciones registradas."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Cost & Delivery Information */}
                    <div className="space-y-6">
                        {/* Cost Information */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                                Información de Costos
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mano de Obra</label>
                                    {editing ? (
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={currentService.costoManoObra || 0}
                                            onChange={(e) => handleInputChange("costoManoObra", Number.parseFloat(e.target.value) || 0)}
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium">${(currentService.costoManoObra || 0).toFixed(2)}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Refacciones</label>
                                    {editing ? (
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={currentService.costoRefacciones || 0}
                                            onChange={(e) => handleInputChange("costoRefacciones", Number.parseFloat(e.target.value) || 0)}
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium">${(currentService.costoRefacciones || 0).toFixed(2)}</p>
                                    )}
                                </div>

                                <div className="border-t pt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Total</label>
                                    <p className="text-2xl font-bold text-green-600">
                                        ${((currentService.costoManoObra || 0) + (currentService.costoRefacciones || 0)).toFixed(2)}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado de Pago</label>
                                    {editing ? (
                                        <select
                                            value={currentService.estadoPago || "Pendiente"}
                                            onChange={(e) => handleInputChange("estadoPago", e.target.value as ServiceDetail["estadoPago"])}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Parcial">Parcial</option>
                                            <option value="Pagado">Pagado</option>
                                        </select>
                                    ) : (
                                        <Badge
                                            className={
                                                currentService.estadoPago === "Pagado"
                                                    ? "bg-green-100 text-green-800"
                                                    : currentService.estadoPago === "Parcial"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                            }
                                        >
                                            {currentService.estadoPago || "Pendiente"}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Delivery Information */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                                Información de Entrega
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Entrega</label>
                                    {editing ? (
                                        <Input
                                            type="date"
                                            value={currentService.fechaEntrega || ""}
                                            onChange={(e) => handleInputChange("fechaEntrega", e.target.value)}
                                        />
                                    ) : (
                                        <p className="text-gray-900">
                                            {currentService.fechaEntrega
                                                ? new Date(currentService.fechaEntrega).toLocaleDateString("es-ES")
                                                : "No definida"}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Técnico Asignado</label>
                                    {editing ? (
                                        <Input
                                            type="text"
                                            value={currentService.tecnico || ""}
                                            onChange={(e) => handleInputChange("tecnico", e.target.value)}
                                            placeholder="Nombre del técnico"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{currentService.tecnico || "No asignado"}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Garantía (días)</label>
                                    {editing ? (
                                        <Input
                                            type="number"
                                            value={currentService.garantia || 30}
                                            onChange={(e) => handleInputChange("garantia", Number.parseInt(e.target.value) || 30)}
                                        />
                                    ) : (
                                        <p className="text-gray-900">{currentService.garantia || 30} días</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>

                            <div className="space-y-3">
                                <Button
                                    onClick={() => router.push(`/clientes/servicios/${currentService.cliente}/nota`)}
                                    variant="outline"
                                    className="w-full justify-start cursor-pointer bg-transparent"
                                >
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Crear Nota de Costos
                                </Button>

                                <Button variant="outline" className="w-full justify-start cursor-pointer bg-transparent">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Llamar Cliente
                                </Button>

                                <Button variant="outline" className="w-full justify-start cursor-pointer bg-transparent">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Generar Reporte
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
