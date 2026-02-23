"use client"

import { Badge } from "@/shared/ui/feedback/Badge"
import { 
    CheckCircle2, 
    Clock, 
    Package, 
    Truck, 
    XCircle,
    AlertCircle
} from "lucide-react"

const ESTADO_COLORS: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
    'CRE': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
    'PAG': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
    'ENV': { bg: 'bg-blue-100', text: 'text-blue-800', icon: Truck },
    'ENT': { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: Package },
    'CAN': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
}

const ESTADO_LABELS: Record<string, string> = {
    'CRE': 'Creado',
    'PAG': 'Pagado',
    'ENV': 'Enviado',
    'ENT': 'Entregado',
    'CAN': 'Cancelado',
}

interface PedidoStatusBadgeProps {
    estado: string
    className?: string
}

export default function PedidoStatusBadge({ estado, className = "" }: PedidoStatusBadgeProps) {
    const estadoInfo = ESTADO_COLORS[estado] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: AlertCircle }
    const EstadoIcon = estadoInfo.icon
    const label = ESTADO_LABELS[estado] || estado

    return (
        <Badge className={`${estadoInfo.bg} ${estadoInfo.text} flex items-center gap-1.5 ${className}`}>
            <EstadoIcon className="h-3.5 w-3.5" />
            <span>{label}</span>
        </Badge>
    )
}

