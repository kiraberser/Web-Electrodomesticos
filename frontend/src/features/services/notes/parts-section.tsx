"use client"

import { Package, Plus, Trash2 } from "lucide-react"
import { Button } from "@/shared/ui/forms/Button"
import { Input } from "@/shared/ui/forms/InputField"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"

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
    const { dark } = useAdminTheme()
    
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className={`block text-sm font-medium flex items-center ${
                    dark ? "text-gray-300" : "text-gray-700"
                }`}>
                    <Package className={`w-4 h-4 mr-2 ${dark ? "text-blue-400" : "text-blue-600"}`} />
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
                    <div className={`text-center py-8 rounded-lg border-2 border-dashed ${
                        dark 
                            ? "text-gray-400 bg-gray-700/50 border-gray-600" 
                            : "text-gray-500 bg-gray-50 border-gray-300"
                    }`}>
                        <Package className={`w-8 h-8 mx-auto mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`} />
                        <p>No hay refacciones agregadas</p>
                        <p className="text-sm">Haz clic en &quot;Agregar&quot; para añadir refacciones</p>
                    </div>
                ) : (
                    parts.map((part, index) => (
                        <div key={index} className={`border rounded-lg p-4 hover:shadow-sm transition-shadow ${
                            dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                        }`}>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                                <div className="md:col-span-2">
                                    <label className={`block text-xs font-medium mb-1 ${
                                        dark ? "text-gray-400" : "text-gray-600"
                                    }`}>Refacción</label>
                                    <Input
                                        type="text"
                                        dark={dark}
                                        value={part.name}
                                        onChange={(e) => onUpdatePart(index, "name", e.target.value)}
                                        placeholder="Nombre de la refacción"
                                        className="text-sm"
                                    />
                                </div>
                                <div>
                                    <label className={`block text-xs font-medium mb-1 ${
                                        dark ? "text-gray-400" : "text-gray-600"
                                    }`}>Cantidad</label>
                                    <Input
                                        type="number"
                                        step="1"
                                        min="1"
                                        dark={dark}
                                        value={part.quantity}
                                        onChange={(e) => onUpdatePart(index, "quantity", Number.parseInt(e.target.value) || 1)}
                                        className="text-sm text-center"
                                    />
                                </div>
                                <div>
                                    <label className={`block text-xs font-medium mb-1 ${
                                        dark ? "text-gray-400" : "text-gray-600"
                                    }`}>Precio</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        dark={dark}
                                        value={part.price}
                                        onChange={(e) => onUpdatePart(index, "price", Number.parseFloat(e.target.value) || 0)}
                                        className="text-sm"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-right">
                                        <div className={`text-xs mb-1 ${dark ? "text-gray-400" : "text-gray-600"}`}>Total</div>
                                        <div className={`text-lg font-semibold ${dark ? "text-green-400" : "text-green-600"}`}>${part.total.toFixed(2)}</div>
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












