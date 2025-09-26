"use client"

import { Calendar } from "lucide-react"
import { Input } from "@/components/ui/forms/InputField"

export default function DeliveryInfoCard({ technician, warranty, onTechnicianChange, onWarrantyChange }: { technician: string; warranty: number; onTechnicianChange: (t: string) => void; onWarrantyChange: (w: number) => void }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                    Información de Entrega
                </h3>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Técnico Asignado</label>
                    <select
                        value={technician}
                        onChange={(e) => onTechnicianChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    >
                        <option value="Jose">José</option>
                        <option value="Alfredo">Alfredo</option>
                        <option value="Edwin">Edwin</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Garantía (días)</label>
                    <Input
                        type="number"
                        value={warranty}
                        onChange={(e) => onWarrantyChange(Number.parseInt(e.target.value) || 30)}
                        min="0"
                        className="focus:ring-2 focus:ring-orange-500"
                    />
                </div>
            </div>
        </div>
    )
}












