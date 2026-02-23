"use client"

import { useState } from "react"
import { Button } from "@/features/admin/ui/Button"
import { Badge } from "@/shared/ui/feedback/Badge"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"
import type { Refaccion } from "@/features/catalog/api"
import { deleteRefaccion } from "@/features/catalog/api"
import { Pencil, Trash2, Package, Eye } from "lucide-react"

interface RefaccionesTableProps {
    refacciones: Refaccion[]
    onEdit: (refaccion: Refaccion) => void
    onView: (refaccion: Refaccion) => void
    onDataChange: () => void
}

const ESTADO_LABELS = {
    'NVO': 'Nuevo',
    'UBS': 'Usado',
    'REC': 'Reacondicionado',
}

const ESTADO_COLORS = {
    'NVO': 'bg-green-100 text-green-800',
    'UBS': 'bg-yellow-100 text-yellow-800',
    'REC': 'bg-blue-100 text-blue-800',
}

const ESTADO_COLORS_DARK = {
    'NVO': 'bg-green-500/20 text-green-400',
    'UBS': 'bg-yellow-500/20 text-yellow-400',
    'REC': 'bg-blue-500/20 text-blue-400',
}

export default function RefaccionesTable({ refacciones, onEdit, onView, onDataChange }: RefaccionesTableProps) {
    const { dark } = useAdminTheme()
    const [deleting, setDeleting] = useState<number | null>(null)

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar esta refacción?")) return

        setDeleting(id)
        try {
            await deleteRefaccion(id)
            onDataChange()
        } catch (err: unknown) {
            // Mostrar mensaje de error específico del backend
            const errorMessage = err?.response?.data?.detail || err?.response?.data?.error || "Error al eliminar la refacción."
            alert(errorMessage)
        } finally {
            setDeleting(null)
        }
    }

    if (refacciones.length === 0) {
        return (
            <div className="p-10 text-center">
                <Package className={`mx-auto mb-3 h-10 w-10 ${dark ? 'text-slate-600' : 'text-gray-400'}`} />
                <h3 className={`mb-1 text-lg font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>Sin refacciones</h3>
                <p className={dark ? 'text-slate-400' : 'text-gray-600'}>No hay refacciones registradas aún.</p>
            </div>
        )
    }

    return (
        <div className="overflow-hidden">
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className={dark ? 'bg-slate-800/50' : 'bg-gray-50'}>
                        <tr className={`text-left text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                            <th className="px-6 py-3">Código</th>
                            <th className="px-6 py-3">Nombre</th>
                            <th className="px-6 py-3">Marca</th>
                            <th className="px-6 py-3">Categoría</th>
                            <th className="px-6 py-3">Precio</th>
                            <th className="px-6 py-3">Stock</th>
                            <th className="px-6 py-3">Estado</th>
                            <th className="px-6 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y text-sm ${dark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                        {refacciones.map((refaccion) => (
                            <tr key={refaccion.id} className={dark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}>
                                <td className={`px-6 py-3 font-mono ${dark ? 'text-slate-400' : 'text-gray-700'}`}>{refaccion.codigo_parte}</td>
                                <td className="px-6 py-3">
                                    <div className={`font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>{refaccion.nombre}</div>
                                    {refaccion.descripcion && (
                                        <div className={`text-xs ${dark ? 'text-slate-500' : 'text-gray-500'}`}>
                                            {refaccion.descripcion.substring(0, 40)}...
                                        </div>
                                    )}
                                </td>
                                <td className={dark ? 'px-6 py-3 text-slate-400' : 'px-6 py-3 text-gray-700'}>{refaccion.marca}</td>
                                <td className={dark ? 'px-6 py-3 text-slate-400' : 'px-6 py-3 text-gray-700'}>{refaccion.categoria_nombre || "-"}</td>
                                <td className={`px-6 py-3 font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>${Number(refaccion.precio).toFixed(2)}</td>
                                <td className="px-6 py-3">
                                    <Badge className={refaccion.existencias > 0 
                                        ? dark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-800'
                                        : dark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-800'
                                    }>
                                        {refaccion.existencias} unidades
                                    </Badge>
                                </td>
                                <td className="px-6 py-3">
                                    <Badge className={dark ? ESTADO_COLORS_DARK[refaccion.estado] : ESTADO_COLORS[refaccion.estado]}>
                                        {ESTADO_LABELS[refaccion.estado]}
                                    </Badge>
                                </td>
                                <td className="px-6 py-3">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onView(refaccion)}
                                            className="bg-transparent cursor-pointer"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(refaccion)}
                                            className="bg-transparent cursor-pointer"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => refaccion.id && handleDelete(refaccion.id)}
                                            loading={deleting === refaccion.id}
                                            disabled={deleting === refaccion.id}
                                            className="cursor-pointer"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="grid gap-3 p-3 lg:hidden">
                {refacciones.map((refaccion) => (
                    <div
                        key={refaccion.id}
                        className={`rounded-lg border p-4 shadow-sm ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}
                    >
                        <div className="mb-2 flex items-center justify-between">
                            <div className={`text-sm font-mono ${dark ? 'text-slate-500' : 'text-gray-500'}`}>{refaccion.codigo_parte}</div>
                            <Badge className={dark ? ESTADO_COLORS_DARK[refaccion.estado] : ESTADO_COLORS[refaccion.estado]}>
                                {ESTADO_LABELS[refaccion.estado]}
                            </Badge>
                        </div>
                        <div className={`text-base font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>{refaccion.nombre}</div>
                        <div className={`mt-2 space-y-1 text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                            <div>Marca: {refaccion.marca}</div>
                            <div>Categoría: {refaccion.categoria_nombre || "-"}</div>
                            <div className="flex items-center justify-between">
                                <span className={`font-semibold text-lg ${dark ? 'text-slate-200' : 'text-gray-900'}`}>${Number(refaccion.precio).toFixed(2)}</span>
                                <Badge className={refaccion.existencias > 0 
                                    ? dark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-800'
                                    : dark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-800'
                                }>
                                    Stock: {refaccion.existencias}
                                </Badge>
                            </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onView(refaccion)}
                                className="bg-transparent cursor-pointer"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(refaccion)}
                                className="flex-1 bg-transparent cursor-pointer"
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => refaccion.id && handleDelete(refaccion.id)}
                                loading={deleting === refaccion.id}
                                disabled={deleting === refaccion.id}
                                className="cursor-pointer"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
