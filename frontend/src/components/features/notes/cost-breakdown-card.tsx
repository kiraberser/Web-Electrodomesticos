"use client"

import { Calculator, DollarSign, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/forms/InputField"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"

interface CostBreakdownCardProps {
    costNote: { laborCost: number }
    errors: Partial<Record<string, string>>
    onInputChange: (field: string, value: string | number) => void
    children: React.ReactNode
}

export default function CostBreakdownCard({ costNote, errors, onInputChange, children }: CostBreakdownCardProps) {
    const { dark } = useAdminTheme()
    
    return (
        <div className={`rounded-xl shadow-sm border overflow-hidden ${
            dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
            <div className={`bg-gradient-to-r px-6 py-4 border-b ${
                dark 
                    ? "from-green-900/30 to-emerald-900/30 border-gray-700" 
                    : "from-green-50 to-emerald-50 border-gray-200"
            }`}>
                <h2 className={`text-lg font-semibold flex items-center ${
                    dark ? "text-gray-100" : "text-gray-900"
                }`}>
                    <Calculator className={`w-5 h-5 mr-2 ${dark ? "text-green-400" : "text-green-600"}`} />
                    Desglose de Costos
                </h2>
            </div>

            <div className="p-6 space-y-6">
                <div className={`rounded-lg p-4 ${dark ? "bg-gray-700/50" : "bg-gray-50"}`}>
                    <label className={`block text-sm font-medium mb-3 flex items-center ${
                        dark ? "text-gray-300" : "text-gray-700"
                    }`}>
                        <DollarSign className={`w-4 h-4 mr-2 ${dark ? "text-green-400" : "text-green-600"}`} />
                        Mano de Obra
                    </label>
                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        dark={dark}
                        value={costNote.laborCost}
                        onChange={(e) => onInputChange("laborCost", Number.parseFloat(e.target.value) || 0)}
                        className={`text-lg font-semibold ${errors.laborCost ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:ring-2 focus:ring-green-500"}`}
                        placeholder="0.00"
                    />
                    {errors.laborCost && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.laborCost}
                        </p>
                    )}
                </div>

                {children}
            </div>
        </div>
    )
}








