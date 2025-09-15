"use client"

import { DollarSign } from "lucide-react"

export default function PaymentStatusCard({ paymentStatus, onPaymentStatusChange }: { paymentStatus: string; onPaymentStatusChange: (s: string) => void }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-yellow-600" />
                    Estado de Pago
                </h3>
            </div>
            <div className="p-6">
                <select
                    value={paymentStatus}
                    onChange={(e) => onPaymentStatusChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Parcial">Parcial</option>
                    <option value="Pagado">Pagado</option>
                </select>
            </div>
        </div>
    )
}





