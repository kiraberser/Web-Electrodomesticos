import type React from "react"

interface InfoItemProps {
    icon: React.ReactNode
    label: string
    value: string
}

export function InfoItem({ icon, label, value }: InfoItemProps) {
    return (
        <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="mt-1">{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
                <p className="text-gray-800 font-medium break-all">{value}</p>
            </div>
        </div>
    )
}

