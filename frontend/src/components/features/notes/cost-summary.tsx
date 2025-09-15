"use client"

import { DollarSign } from "lucide-react"

export default function CostSummary({ totalCost, laborCost, partsCost }: { totalCost: number; laborCost: number; partsCost: number }) {
    return (
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg text-white overflow-hidden">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Total a Cobrar</h3>
                    <DollarSign className="w-6 h-6" />
                </div>
                <div className="text-4xl font-bold mb-2">${totalCost.toFixed(2)}</div>
                <div className="text-green-100 text-sm">MXN</div>
                <div className="mt-6 pt-4 border-t border-green-400 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-green-100">Mano de obra:</span>
                        <span>${laborCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-green-100">Refacciones:</span>
                        <span>${partsCost.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}






