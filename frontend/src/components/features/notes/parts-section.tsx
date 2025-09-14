"use client"

import { Package, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/forms/Button"
import { Input } from "@/components/ui/forms/InputField"

interface Part {
    name: string
    quantity: number
    price: number
    total: number
}

export default function PartsSection({
    parts,
    onAddPart,
    onRemovePart,
    onUpdatePart,
}: {
    parts: Part[]
    onAddPart: () => void
    onRemovePart: (index: number) => void
    onUpdatePart: (index: number, field: keyof Part, value: string | number) => void
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <Package className="w-4 h-4 mr-2 text-blue-600" />
                    Refacciones
                </label>
                <Button
                    variant="outline"
                    onClick={onAddPart}
                    className="cursor-pointer bg-transparent hover:bg-blue-50 border-blue-200 text-blue-600"
                    size="sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar
                </Button>
            </div>

            <div className="space-y-3">
                {parts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>No hay refacciones agregadas</p>
                        <p className="text-sm">Haz clic en "Agregar" para añadir refacciones</p>
                    </div>
                ) : (
                    parts.map((part, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Refacción</label>
                                    <Input
                                        type="text"
                                        value={part.name}
                                        onChange={(e) => onUpdatePart(index, "name", e.target.value)}
                                        placeholder="Nombre de la refacción"
                                        className="text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Cantidad</label>
                                    <Input
                                        type="number"
                                        step="1"
                                        min="1"
                                        value={part.quantity}
                                        onChange={(e) => onUpdatePart(index, "quantity", Number.parseInt(e.target.value) || 1)}
                                        className="text-sm text-center"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Precio</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={part.price}
                                        onChange={(e) => onUpdatePart(index, "price", Number.parseFloat(e.target.value) || 0)}
                                        className="text-sm"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-right">
                                        <div className="text-xs text-gray-600 mb-1">Total</div>
                                        <div className="text-lg font-semibold text-green-600">${part.total.toFixed(2)}</div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onRemovePart(index)}
                                        className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}




