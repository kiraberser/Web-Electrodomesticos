"use client"

import { Calculator, DollarSign, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/forms/InputField"

interface CostBreakdownCardProps {
    costNote: { laborCost: number }
    errors: Partial<Record<string, string>>
    onInputChange: (field: string, value: string | number) => void
    children: React.ReactNode
}

export default function CostBreakdownCard({ costNote, errors, onInputChange, children }: CostBreakdownCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-green-600" />
                    Desglose de Costos
                </h2>
            </div>

            <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                        Mano de Obra
                    </label>
                    <Input
                        type="number"
                        step="0.01"
                        min="0"
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




