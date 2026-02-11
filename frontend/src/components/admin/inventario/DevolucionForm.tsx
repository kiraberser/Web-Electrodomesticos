"use client"

import { useEffect, useState, useMemo, useActionState } from "react"
import { useFormStatus } from "react-dom"
import Image from "next/image"
import { Button } from "@/components/admin/ui/Button"
import { Input } from "@/components/admin/ui/Input"
import { Select } from "@/components/admin/ui/Select"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import { registrarDevolucionAction } from "@/actions/inventario"
import type { Refaccion, Categoria } from "@/api/productos"
import { RotateCcw, X, MapPin } from "lucide-react"

interface DevolucionFormProps {
    refacciones: Refaccion[]
    categorias: Categoria[]
    onSuccess: () => void
    onCancel: () => void
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            variant="secondary"
            disabled={pending}
            className="flex-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Registrando...
                </>
            ) : (
                <>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Registrar Devolucion
                </>
            )}
        </Button>
    )
}

export default function DevolucionForm({ refacciones, categorias, onSuccess, onCancel }: DevolucionFormProps) {
    const { dark } = useAdminTheme()
    const [state, formAction] = useActionState(registrarDevolucionAction, { success: false, error: null })
    const [selectedCategoria, setSelectedCategoria] = useState<string>("")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedRefId, setSelectedRefId] = useState<string>("")

    useEffect(() => {
        if (state.success) onSuccess()
    }, [state.success, onSuccess])

    const filteredRefacciones = useMemo(() => {
        let list = refacciones
        if (selectedCategoria) {
            list = list.filter(r => String(r.categoria) === selectedCategoria)
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            list = list.filter(r =>
                r.nombre.toLowerCase().includes(q) ||
                r.codigo_parte.toLowerCase().includes(q) ||
                String(r.id).includes(q)
            )
        }
        return list
    }, [refacciones, selectedCategoria, searchQuery])

    const selectedRef = refacciones.find(r => String(r.id) === selectedRefId)

    return (
        <form action={formAction} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${dark ? 'text-gray-100' : 'text-gray-900'}`}>
                    Registrar Devolucion
                </h3>
                <button type="button" onClick={onCancel} className={dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}>
                    <X className="h-5 w-5" />
                </button>
            </div>

            {state.error && typeof state.error === 'string' && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{state.error}</div>
            )}

            <Select
                label="Filtrar por categoria"
                value={selectedCategoria}
                onChange={(e) => { setSelectedCategoria(e.target.value); setSelectedRefId("") }}
            >
                <option value="">Todas las categorias</option>
                {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
            </Select>

            <Input
                label="Buscar por ID, nombre o codigo"
                placeholder="Ej: 123 o Motor..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSelectedRefId("") }}
            />

            <Select
                label="Refaccion *"
                name="refaccion"
                required
                value={selectedRefId}
                onChange={(e) => setSelectedRefId(e.target.value)}
            >
                <option value="">Seleccionar refaccion...</option>
                {filteredRefacciones.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.nombre} ({r.codigo_parte})
                    </option>
                ))}
            </Select>
            {state.error && typeof state.error === 'object' && state.error !== null && 'refaccion' in state.error && (
                <p className="text-red-500 text-sm">{(state.error as Record<string, { _errors: string[] }>).refaccion._errors[0]}</p>
            )}

            {selectedRef && (
                <div className={`flex items-center gap-3 rounded-lg border p-3 ${dark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                    {selectedRef.imagen && (
                        <Image
                            src={selectedRef.imagen}
                            alt={selectedRef.nombre}
                            width={40}
                            height={40}
                            className="rounded object-cover"
                        />
                    )}
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${dark ? 'text-slate-200' : 'text-gray-900'}`}>{selectedRef.nombre}</p>
                        <p className={`text-xs ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Stock: {selectedRef.existencias} &middot; {selectedRef.marca}
                        </p>
                        {selectedRef.ubicacion_estante && (
                            <p className={`text-xs flex items-center gap-1 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                <MapPin className="h-3 w-3" /> {selectedRef.ubicacion_estante}
                            </p>
                        )}
                    </div>
                </div>
            )}

            <Input
                label="Cantidad *"
                name="cantidad"
                type="number"
                min={1}
                placeholder="Ej: 2"
                required
            />
            {state.error && typeof state.error === 'object' && state.error !== null && 'cantidad' in state.error && (
                <p className="text-red-500 text-sm">{(state.error as Record<string, { _errors: string[] }>).cantidad._errors[0]}</p>
            )}

            <Input
                label="Precio Unitario"
                name="precio_unitario"
                type="number"
                min={0}
                step="0.01"
                placeholder="Opcional"
            />

            <Input
                label="ID de Venta"
                name="venta_id"
                type="number"
                min={1}
                placeholder="Opcional"
                description="ID de la venta original (si aplica)"
            />

            <div className="space-y-1.5">
                <label className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>Motivo</label>
                <textarea
                    name="motivo"
                    rows={3}
                    placeholder="Motivo de la devolucion (opcional)"
                    className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'border-white/10 bg-white/5 text-gray-100 placeholder-gray-400 focus:border-white/20' : 'border-black/10 bg-white text-gray-800 placeholder-gray-500 focus:border-black/20'}`}
                />
            </div>

            <div className="space-y-1.5">
                <label className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>Observaciones</label>
                <textarea
                    name="observaciones"
                    rows={2}
                    placeholder="Observaciones (opcional)"
                    className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'border-white/10 bg-white/5 text-gray-100 placeholder-gray-400 focus:border-white/20' : 'border-black/10 bg-white text-gray-800 placeholder-gray-500 focus:border-black/20'}`}
                />
            </div>

            <div className="flex gap-3 pt-2">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    className="flex-1 cursor-pointer"
                >
                    Cancelar
                </Button>
                <SubmitButton />
            </div>
        </form>
    )
}
