"use client"

import { FileText } from "lucide-react"

interface ServiceObservationsProps {
    observations: string
}

export function ServiceObservations({ observations }: ServiceObservationsProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Observaciones 
            </h2>

            <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                    {observations || "Sin observaciones registradas."}
                </p>
            </div>
        </div>
    )
}
