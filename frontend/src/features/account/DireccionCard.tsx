"use client"

import { MapPin, Edit, Trash2, Star } from "lucide-react"
import { Button } from "@/shared/ui/forms/Button"
import type { Direccion } from "@/shared/types/user"

interface DireccionCardProps {
    direccion: Direccion
    onEdit: () => void
    onDelete: () => void
    onSetPrimary?: () => void
}

export function DireccionCard({ direccion, onEdit, onDelete, onSetPrimary }: DireccionCardProps) {
    return (
        <div className={`bg-white rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
            direccion.is_primary 
                ? 'border-[#E38E49] bg-[#FFF8F3]' 
                : 'border-gray-200'
        }`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4 gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                        direccion.is_primary 
                            ? 'bg-[#E38E49]' 
                            : 'bg-[#0A3981]'
                    }`}>
                        <MapPin className="text-white" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-[#0A3981] break-words">
                            {direccion.nombre}
                        </h3>
                        {direccion.is_primary && (
                            <div className="flex items-center gap-1 mt-1">
                                <Star className="text-[#E38E49] flex-shrink-0" size={14} fill="#E38E49" />
                                <span className="text-xs font-medium text-[#E38E49]">
                                    Dirección Principal
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    {!direccion.is_primary && onSetPrimary && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onSetPrimary}
                            className="text-xs px-2 py-1.5 whitespace-nowrap"
                            title="Marcar como principal"
                        >
                            <Star className="w-3 h-3" />
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onEdit}
                        className="text-[#0A3981] border-[#0A3981] hover:bg-[#0A3981] hover:text-white p-1.5"
                        title="Editar"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onDelete}
                        className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white p-1.5"
                        title="Eliminar"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Address Details */}
            <div className="space-y-2 text-gray-700">
                <p className="font-medium">{direccion.street}</p>
                <p>{direccion.colony}</p>
                <p>
                    {direccion.city}, {direccion.state}
                </p>
                <p className="text-sm text-gray-600">CP: {direccion.postal_code}</p>
                {direccion.references && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-500 mb-1">Referencias:</p>
                        <p className="text-sm text-gray-600 italic">{direccion.references}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

