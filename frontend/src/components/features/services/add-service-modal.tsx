"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus, Calendar, Package, User, Phone, FileText } from "lucide-react"
import { Button } from "@/components/ui/forms/Button"
import { Input } from "@/components/ui/forms/InputField"

interface Service {
    fecha: string
    aparato: string
    telefono: string
    cliente: string
    observaciones: string
    estado: "Pendiente" | "En Proceso" | "Reparado" | "Entregado" | "Cancelado"
    marca: number
}

interface AddServiceModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (service: Service) => void
}

export default function AddServiceModal({ isOpen, onClose, onSubmit }: AddServiceModalProps) {
    const [formData, setFormData] = useState<Service>({
        fecha: new Date().toISOString().split("T")[0],
        aparato: "",
        telefono: "",
        cliente: "",
        observaciones: "",
        estado: "Pendiente",
        marca: 1,
    })

    const [errors, setErrors] = useState<Partial<Record<keyof Service, string>>>({})

    const validateForm = () => {
        const newErrors: Partial<Record<keyof Service, string>> = {}

        if (!formData.cliente.trim()) {
            newErrors.cliente = "El nombre del cliente es requerido"
        }

        if (!formData.aparato.trim()) {
            newErrors.aparato = "El tipo de aparato es requerido"
        }

        if (!formData.telefono.trim()) {
            newErrors.telefono = "El teléfono es requerido"
        } else if (!/^\d{10}$/.test(formData.telefono.replace(/\D/g, ""))) {
            newErrors.telefono = "El teléfono debe tener 10 dígitos"
        }

        if (!formData.fecha) {
            newErrors.fecha = "La fecha es requerida"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (validateForm()) {
            onSubmit(formData)
            // Reset form
            setFormData({
                fecha: new Date().toISOString().split("T")[0],
                aparato: "",
                telefono: "",
                cliente: "",
                observaciones: "",
                estado: "Pendiente",
                marca: 1,
            })
            setErrors({})
        }
    }

    const handleInputChange = (field: keyof Service, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

                {/* Modal */}
                <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 transform transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Plus className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Nuevo Servicio</h3>
                                <p className="text-sm text-gray-500">Registra un nuevo servicio de reparación</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Cliente */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <User className="w-4 h-4 inline mr-2" />
                                    Cliente *
                                </label>
                                <Input
                                    type="text"
                                    value={formData.cliente}
                                    onChange={(e) => handleInputChange("cliente", e.target.value)}
                                    placeholder="Nombre del cliente"
                                    className={`${errors.cliente ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                                />
                                {errors.cliente && <p className="text-red-500 text-sm mt-1">{errors.cliente}</p>}
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone className="w-4 h-4 inline mr-2" />
                                    Teléfono *
                                </label>
                                <Input
                                    type="tel"
                                    value={formData.telefono}
                                    onChange={(e) => handleInputChange("telefono", e.target.value)}
                                    placeholder="2321234567"
                                    className={`${errors.telefono ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                                />
                                {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
                            </div>

                            {/* Aparato */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Package className="w-4 h-4 inline mr-2" />
                                    Aparato *
                                </label>
                                <Input
                                    type="text"
                                    value={formData.aparato}
                                    onChange={(e) => handleInputChange("aparato", e.target.value)}
                                    placeholder="Licuadora, Bomba de Agua, etc."
                                    className={`${errors.aparato ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                                />
                                {errors.aparato && <p className="text-red-500 text-sm mt-1">{errors.aparato}</p>}
                            </div>

                            {/* Fecha */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-2" />
                                    Fecha *
                                </label>
                                <Input
                                    type="date"
                                    value={formData.fecha}
                                    onChange={(e) => handleInputChange("fecha", e.target.value)}
                                    className={`${errors.fecha ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                                />
                                {errors.fecha && <p className="text-red-500 text-sm mt-1">{errors.fecha}</p>}
                            </div>

                            {/* Estado */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                <select
                                    value={formData.estado}
                                    onChange={(e) => handleInputChange("estado", e.target.value as Service["estado"])}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En Proceso">En Proceso</option>
                                    <option value="Reparado">Reparado</option>
                                    <option value="Entregado">Entregado</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                            </div>

                            {/* Marca */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                                <Input
                                    type="number"
                                    value={formData.marca}
                                    onChange={(e) => handleInputChange("marca", Number.parseInt(e.target.value) || 1)}
                                    placeholder="1"
                                    min="1"
                                />
                            </div>
                        </div>

                        {/* Observaciones */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FileText className="w-4 h-4 inline mr-2" />
                                Observaciones
                            </label>
                            <textarea
                                value={formData.observaciones}
                                onChange={(e) => handleInputChange("observaciones", e.target.value)}
                                placeholder="Describe el problema o detalles adicionales..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            />
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                            <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer bg-transparent">
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                                <Plus className="w-4 h-4 mr-2" />
                                Crear Servicio
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
