"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/admin/ui"
import { Input } from "@/components/admin/ui/Input"
import { ImageUpload } from "@/components/admin/ui"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import { createCategoriaAction, updateCategoriaAction } from "@/actions/productos"
import { X, Plus } from "lucide-react"
import type { Categoria } from "@/api/productos"

interface CategoriaFormProps {
    categoria?: Categoria | null
    onSuccess: () => void
    onCancel: () => void
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus()

    return (
        <Button
            type="submit"
            variant="primary"
            disabled={pending}
            className="flex-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEditing ? "Actualizando..." : "Creando..."}
                </>
            ) : (
                <>
                    <Plus className="mr-2 h-4 w-4" />
                    {isEditing ? "Actualizar" : "Crear"} Categoría
                </>
            )}
        </Button>
    )
}

export default function CategoriaForm({ categoria, onSuccess, onCancel }: CategoriaFormProps) {
    const { dark } = useAdminTheme()
    const initialState = { success: false, error: null }
    const action = categoria?.id ? updateCategoriaAction : createCategoriaAction
    const [state, formAction] = useActionState(action, initialState)

    useEffect(() => {
        if (state.success) {
            onSuccess()
        }
    }, [state.success, onSuccess])

    return (
        <form action={formAction} className="space-y-4">
            {/* Hidden field for ID when editing */}
            {categoria?.id && <input type="hidden" name="id" value={categoria.id} />}

            <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                    {categoria ? "Editar Categoría" : "Nueva Categoría"}
                </h3>
                <button
                    type="button"
                    onClick={onCancel}
                    className={`transition ${dark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Global error message */}
            {state.error && typeof state.error === 'string' && (
                <div className={`rounded-lg p-3 text-sm ${dark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-800'}`}>
                    {state.error}
                </div>
            )}

            <div>
                <Input
                    label="Nombre de la categoría *"
                    name="nombre"
                    placeholder="Ej: Refrigeradores, Lavadoras"
                    defaultValue={categoria?.nombre || ""}
                    required
                />
                {state.error && typeof state.error === 'object' && state.error.nombre?._errors?.length > 0 && (
                    <p className={`text-sm mt-1 ${dark ? 'text-red-400' : 'text-red-500'}`}>{state.error.nombre._errors[0]}</p>
                )}
            </div>

            <div className="space-y-1.5">
                <label className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                    Descripción
                </label>
                <textarea
                    name="descripcion"
                    placeholder="Descripción de la categoría"
                    rows={4}
                    defaultValue={categoria?.descripcion || ""}
                    className={`flex min-h-[60px] w-full rounded-md border px-3 py-2 text-base shadow-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                        dark 
                            ? 'bg-slate-800 border-slate-700 text-gray-200 placeholder:text-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                    }`}
                />
            </div>

            <ImageUpload
                label="Imagen de la categoría"
                name="imagen"
                currentImage={categoria?.imagen}
            />

            <div className="flex gap-2 pt-4">
                <SubmitButton isEditing={!!categoria?.id} />
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="cursor-pointer"
                >
                    Cancelar
                </Button>
            </div>
        </form>
    )
}
