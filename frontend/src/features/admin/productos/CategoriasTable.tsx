"use client"

import { useState } from "react"
import { Button } from "@/features/admin/ui/Button"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"
import type { Categoria } from "@/features/catalog/api"
import { deleteCategoria } from "@/features/catalog/api"
import { Pencil, Trash2, Package, ImageIcon } from "lucide-react"
import Image from "next/image"

interface CategoriasTableProps {
    categorias: Categoria[]
    onEdit: (categoria: Categoria) => void
    onDataChange: () => void
}

export default function CategoriasTable({ categorias, onEdit, onDataChange }: CategoriasTableProps) {
    const { dark } = useAdminTheme()
    const [deleting, setDeleting] = useState<number | null>(null)

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar esta categoría?")) return

        setDeleting(id)
        try {
            await deleteCategoria(id)
            onDataChange()
        } catch {
            alert("Error al eliminar la categoría. Puede que tenga productos asociados.")
        } finally {
            setDeleting(null)
        }
    }

    if (categorias.length === 0) {
        return (
            <div className="p-10 text-center">
                <Package className={`mx-auto mb-3 h-10 w-10 ${dark ? 'text-slate-600' : 'text-gray-400'}`} />
                <h3 className={`mb-1 text-lg font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>Sin categorías</h3>
                <p className={dark ? 'text-slate-400' : 'text-gray-600'}>No hay categorías registradas aún.</p>
            </div>
        )
    }

    return (
        <div className="overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className={dark ? 'bg-slate-800/50' : 'bg-gray-50'}>
                        <tr className={`text-left text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                            <th className="px-6 py-3">Imagen</th>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Nombre</th>
                            <th className="px-6 py-3">Descripción</th>
                            <th className="px-6 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y text-sm ${dark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                        {categorias.map((categoria) => (
                            <tr key={categoria.id} className={dark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}>
                                <td className="px-6 py-3">
                                    <div className={`relative h-12 w-12 rounded-lg border overflow-hidden ${dark ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                                        {categoria.imagen ? (
                                            <Image
                                                src={categoria.imagen}
                                                alt={categoria.nombre}
                                                fill
                                                className="object-contain p-1"
                                                sizes="48px"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <ImageIcon className={`h-5 w-5 ${dark ? 'text-slate-600' : 'text-gray-400'}`} />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className={`px-6 py-3 font-mono ${dark ? 'text-slate-400' : 'text-gray-700'}`}>{categoria.id}</td>
                                <td className={`px-6 py-3 font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>{categoria.nombre}</td>
                                <td className={dark ? 'px-6 py-3 text-slate-400' : 'px-6 py-3 text-gray-700'}>
                                    {categoria.descripcion 
                                        ? categoria.descripcion.substring(0, 60) + (categoria.descripcion.length > 60 ? "..." : "")
                                        : "-"
                                    }
                                </td>
                                <td className="px-6 py-3">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(categoria)}
                                            className="bg-transparent cursor-pointer"
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Editar
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => categoria.id && handleDelete(categoria.id)}
                                            loading={deleting === categoria.id}
                                            disabled={deleting === categoria.id}
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
            <div className="grid gap-3 p-3 md:hidden">
                {categorias.map((categoria) => (
                    <div
                        key={categoria.id}
                        className={`rounded-lg border p-4 shadow-sm ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}
                    >
                        <div className="mb-3 flex items-start gap-3">
                            <div className={`relative h-16 w-16 flex-shrink-0 rounded-lg border overflow-hidden ${dark ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                                {categoria.imagen ? (
                                    <Image
                                        src={categoria.imagen}
                                        alt={categoria.nombre}
                                        fill
                                        className="object-contain p-2"
                                        sizes="64px"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <ImageIcon className={`h-6 w-6 ${dark ? 'text-slate-600' : 'text-gray-400'}`} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className={`text-sm font-mono ${dark ? 'text-slate-500' : 'text-gray-500'}`}>#{categoria.id}</div>
                                <div className={`text-base font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>{categoria.nombre}</div>
                                {categoria.descripcion && (
                                    <div className={`mt-1 text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>{categoria.descripcion}</div>
                                )}
                            </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(categoria)}
                                className="flex-1 bg-transparent cursor-pointer"
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => categoria.id && handleDelete(categoria.id)}
                                loading={deleting === categoria.id}
                                disabled={deleting === categoria.id}
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
