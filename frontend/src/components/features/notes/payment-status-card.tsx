"use client"

import { DollarSign } from "lucide-react"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"

export default function PaymentStatusCard({ paymentStatus, onPaymentStatusChange }: { paymentStatus: string; onPaymentStatusChange: (s: string) => void }) {
    const { dark } = useAdminTheme()
    
    return (
        <div className={`rounded-xl shadow-sm border overflow-hidden ${
            dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
            <div className={`bg-gradient-to-r px-6 py-4 border-b ${
                dark 
                    ? "from-yellow-900/30 to-orange-900/30 border-gray-700" 
                    : "from-yellow-50 to-orange-50 border-gray-200"
            }`}>
                <h3 className={`text-lg font-semibold flex items-center ${
                    dark ? "text-gray-100" : "text-gray-900"
                }`}>
                    <DollarSign className={`w-5 h-5 mr-2 ${dark ? "text-yellow-400" : "text-yellow-600"}`} />
                    Estado de Pago
                </h3>
            </div>
            <div className="p-6">
                <select
                    value={paymentStatus}
                    onChange={(e) => onPaymentStatusChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 ${
                        dark 
                            ? "bg-gray-800 text-gray-100 border-gray-600" 
                            : "bg-white text-gray-900 border-gray-300"
                    }`}
                >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Parcial">Parcial</option>
                    <option value="Pagado">Pagado</option>
                </select>
            </div>
        </div>
    )
}












