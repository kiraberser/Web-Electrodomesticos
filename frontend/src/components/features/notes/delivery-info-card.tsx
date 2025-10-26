"use client"

import { Calendar } from "lucide-react"
import { Input } from "@/components/ui/forms/InputField"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"

export default function DeliveryInfoCard({ technician, warranty, onTechnicianChange, onWarrantyChange }: { technician: string; warranty: number; onTechnicianChange: (t: string) => void; onWarrantyChange: (w: number) => void }) {
    const { dark } = useAdminTheme()
    
    return (
        <div className={`rounded-xl shadow-sm border overflow-hidden ${
            dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
            <div className={`bg-gradient-to-r px-6 py-4 border-b ${
                dark 
                    ? "from-orange-900/30 to-red-900/30 border-gray-700" 
                    : "from-orange-50 to-red-50 border-gray-200"
            }`}>
                <h3 className={`text-lg font-semibold flex items-center ${
                    dark ? "text-gray-100" : "text-gray-900"
                }`}>
                    <Calendar className={`w-5 h-5 mr-2 ${dark ? "text-orange-400" : "text-orange-600"}`} />
                    Información de Entrega
                </h3>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label className={`block text-sm font-medium mb-2 ${
                        dark ? "text-gray-300" : "text-gray-700"
                    }`}>Técnico Asignado</label>
                    <select
                        value={technician}
                        onChange={(e) => onTechnicianChange(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                            dark 
                                ? "bg-gray-800 text-gray-100 border-gray-600" 
                                : "bg-white text-gray-900 border-gray-300"
                        }`}
                    >
                        <option value="Jose">José</option>
                        <option value="Alfredo">Alfredo</option>
                        <option value="Edwin">Edwin</option>
                    </select>
                </div>
                <div>
                    <label className={`block text-sm font-medium mb-2 ${
                        dark ? "text-gray-300" : "text-gray-700"
                    }`}>Garantía (días)</label>
                    <Input
                        type="number"
                        dark={dark}
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












