"use client"

import { Package, User, Calendar, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/forms/InputField"

interface ServiceInfoCardProps {
    costNote: {
        serviceNumber: number
        clientName: string
        deviceName: string
        deliveryDate: string
    }
    errors: Partial<Record<string, string>>
    onInputChange: (field: string, value: string | number) => void
}

export default function ServiceInfoCard({ costNote, errors, onInputChange }: ServiceInfoCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Información del Servicio
                </h2>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-500" />
                            Cliente *
                        </label>
                        <Input
                            type="text"
                            value={costNote.clientName}
                            onChange={(e) => onInputChange("clientName", e.target.value)}
                            className={`transition-all duration-200 ${errors.clientName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:ring-2 focus:ring-blue-500"}`}
                            placeholder="Nombre del cliente"
                        />
                        {errors.clientName && (
                            <p className="text-red-500 text-sm flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.clientName}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <Package className="w-4 h-4 mr-2 text-gray-500" />
                            Aparato *
                        </label>
                        <Input
                            type="text"
                            value={costNote.deviceName}
                            onChange={(e) => onInputChange("deviceName", e.target.value)}
                            className={`transition-all duration-200 ${errors.deviceName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:ring-2 focus:ring-blue-500"}`}
                            placeholder="Tipo de aparato"
                        />
                        {errors.deviceName && (
                            <p className="text-red-500 text-sm flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.deviceName}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Número de Servicio</label>
                        <Input type="number" value={costNote.serviceNumber} readOnly className="bg-gray-50 cursor-not-allowed" />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                            Fecha de Entrega *
                        </label>
                        <Input
                            type="date"
                            value={costNote.deliveryDate}
                            onChange={(e) => onInputChange("deliveryDate", e.target.value)}
                            className={`transition-all duration-200 ${errors.deliveryDate ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:ring-2 focus:ring-blue-500"}`}
                        />
                        {errors.deliveryDate && (
                            <p className="text-red-500 text-sm flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.deliveryDate}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}




