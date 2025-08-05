"use client"

import { AlertTriangle, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/forms/Button"

interface Service {
    noDeServicio: number
    fecha: string
    aparato: string
    telefono: string
    cliente: string
    observaciones: string
    estado: string
    marca: number
}

interface DeleteServiceModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    service: Service | null
}

export default function DeleteServiceModal({ isOpen, onClose, onConfirm, service }: DeleteServiceModalProps) {
    if (!isOpen || !service) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

                {/* Modal */}
                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Eliminar Servicio</h3>
                                <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
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

                    {/* Content */}
                    <div className="p-6">
                        <div className="mb-4">
                            <p className="text-gray-700 mb-4">¿Estás seguro de que deseas eliminar el siguiente servicio?</p>

                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-500">No. Servicio:</span>
                                    <span className="text-sm font-semibold text-gray-900">#{service.noDeServicio}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-500">Cliente:</span>
                                    <span className="text-sm text-gray-900">{service.cliente}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-500">Aparato:</span>
                                    <span className="text-sm text-gray-900">{service.aparato}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-500">Estado:</span>
                                    <span className="text-sm text-gray-900">{service.estado}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-medium text-red-800">Advertencia</h4>
                                    <p className="text-sm text-red-700 mt-1">
                                        Al eliminar este servicio, se perderán todos los datos asociados incluyendo observaciones, historial
                                        y cualquier información relacionada. Esta acción es permanente.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                        <Button variant="outline" onClick={onClose} className="cursor-pointer bg-transparent">
                            Cancelar
                        </Button>
                        <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar Servicio
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}