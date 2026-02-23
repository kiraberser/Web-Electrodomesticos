"use client"

import { Button } from "@/features/admin/ui/Button"
import { Badge } from "@/shared/ui/feedback/Badge"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"
import type { Refaccion } from "@/features/catalog/api"
import { X, Package, Wrench, DollarSign, Calendar, ImageIcon } from "lucide-react"
import Image from "next/image"

interface RefaccionDrawerProps {
    refaccion: Refaccion | null
    open: boolean
    onClose: () => void
    onEdit: () => void
}

const ESTADO_LABELS = {
    'NVO': 'Nuevo',
    'UBS': 'Usado - Buen Estado',
    'REC': 'Reacondicionado',
}

const ESTADO_COLORS = {
    'NVO': 'bg-green-600 text-white',
    'UBS': 'bg-yellow-600 text-white',
    'REC': 'bg-blue-600 text-white',
}

const ESTADO_COLORS_DARK = {
    'NVO': 'bg-green-500 text-white',
    'UBS': 'bg-yellow-500 text-white',
    'REC': 'bg-blue-500 text-white',
}

export default function RefaccionDrawer({ refaccion, open, onClose, onEdit }: RefaccionDrawerProps) {
    const { dark } = useAdminTheme()
    
    if (!open || !refaccion) return null

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <aside
                className={`absolute right-0 top-0 h-full w-full max-w-xl border-l shadow-xl overflow-y-auto ${
                    dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'
                }`}
                role="dialog"
                aria-label="Detalle de refacción"
            >
                {/* Header */}
                <div className={`sticky top-0 z-10 flex items-center justify-between border-b p-4 ${
                    dark ? 'border-slate-800 bg-slate-900' : 'bg-white'
                }`}>
                    <div>
                        <div className={`text-sm font-mono ${dark ? 'text-slate-500' : 'text-gray-500'}`}>{refaccion.codigo_parte}</div>
                        <h3 className={`text-lg font-semibold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>{refaccion.nombre}</h3>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose} className="cursor-pointer">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex flex-col p-4 space-y-4">
                    {/* Image */}
                    {refaccion.imagen ? (
                        <div className={`rounded-lg border overflow-hidden ${dark ? 'border-slate-800 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="relative aspect-video w-full">
                                <Image
                                    src={refaccion.imagen}
                                    alt={refaccion.nombre}
                                    fill
                                    className="object-contain p-4"
                                    sizes="(max-width: 768px) 100vw, 576px"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className={`rounded-lg border p-8 ${dark ? 'border-slate-800 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className={`rounded-full p-4 mb-3 ${dark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                                    <ImageIcon className={`h-8 w-8 ${dark ? 'text-slate-500' : 'text-gray-400'}`} />
                                </div>
                                <p className={`text-sm ${dark ? 'text-slate-500' : 'text-gray-500'}`}>Sin imagen</p>
                            </div>
                        </div>
                    )}

                    {/* Status badges */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge className={dark ? ESTADO_COLORS_DARK[refaccion.estado] : ESTADO_COLORS[refaccion.estado]}>
                            {ESTADO_LABELS[refaccion.estado]}
                        </Badge>
                        <Badge className={refaccion.existencias > 0 
                            ? dark ? 'bg-green-500 text-white' : 'bg-green-600 text-white' 
                            : dark ? 'bg-red-500 text-white' : 'bg-red-600 text-white'
                        }>
                            {refaccion.existencias > 0 ? `${refaccion.existencias} en stock` : 'Agotado'}
                        </Badge>
                    </div>

                    {/* Main info */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}>
                            <div className={`flex items-center gap-2 text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                <DollarSign className="h-4 w-4" />
                                Precio unitario
                            </div>
                            <div className={`mt-1 text-2xl font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>${Number(refaccion.precio).toFixed(2)}</div>
                        </div>
                        <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}>
                            <div className={`flex items-center gap-2 text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                <Package className="h-4 w-4" />
                                Existencias
                            </div>
                            <div className={`mt-1 text-2xl font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>{refaccion.existencias} unidades</div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                        <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                            <div className={`mb-2 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>Información general</div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className={dark ? 'text-slate-400' : 'text-gray-600'}>Marca:</span>
                                    <span className={`font-medium ${dark ? 'text-slate-200' : 'text-gray-900'}`}>{refaccion.marca}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={dark ? 'text-slate-400' : 'text-gray-600'}>Categoría:</span>
                                    <span className={`font-medium ${dark ? 'text-slate-200' : 'text-gray-900'}`}>{refaccion.categoria_nombre || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={dark ? 'text-slate-400' : 'text-gray-600'}>Código de parte:</span>
                                    <span className={`font-mono font-medium ${dark ? 'text-slate-200' : 'text-gray-900'}`}>{refaccion.codigo_parte}</span>
                                </div>
                            </div>
                        </div>

                        {refaccion.descripcion && (
                            <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                                <div className={`mb-2 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>Descripción</div>
                                <p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-700'}`}>{refaccion.descripcion}</p>
                            </div>
                        )}

                        <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                            <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                <Wrench className="h-4 w-4" />
                                Compatibilidad
                            </div>
                            <p className={`text-sm whitespace-pre-wrap ${dark ? 'text-slate-400' : 'text-gray-700'}`}>{refaccion.compatibilidad}</p>
                        </div>

                        {(refaccion.fecha_ingreso || refaccion.ultima_actualizacion) && (
                            <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                                <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                    <Calendar className="h-4 w-4" />
                                    Fechas
                                </div>
                                <div className="space-y-1 text-sm">
                                    {refaccion.fecha_ingreso && (
                                        <div className="flex justify-between">
                                            <span className={dark ? 'text-slate-400' : 'text-gray-600'}>Ingreso:</span>
                                            <span className={`font-medium ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                                {new Date(refaccion.fecha_ingreso).toLocaleDateString('es-MX')}
                                            </span>
                                        </div>
                                    )}
                                    {refaccion.ultima_actualizacion && (
                                        <div className="flex justify-between">
                                            <span className={dark ? 'text-slate-400' : 'text-gray-600'}>Última actualización:</span>
                                            <span className={`font-medium ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                                {new Date(refaccion.ultima_actualizacion).toLocaleDateString('es-MX')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className={`sticky bottom-0 mt-auto border-t pt-4 ${
                        dark ? 'border-slate-800 bg-slate-900' : 'bg-white'
                    }`}>
                        <Button
                            variant="primary"
                            className="w-full cursor-pointer"
                            onClick={onEdit}
                        >
                            Editar Refacción
                        </Button>
                    </div>
                </div>
            </aside>
        </div>
    )
}
