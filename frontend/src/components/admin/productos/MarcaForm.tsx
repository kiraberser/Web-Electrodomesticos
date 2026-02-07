// @ts-nocheck - React 19 useActionState typing issue
"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/admin/ui/Button"
import { Input } from "@/components/admin/ui/Input"
import { ImageUpload } from "@/components/admin/ui/ImageUpload"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import { createMarcaAction, updateMarcaAction } from "@/actions/productos"
import { X, Plus } from "lucide-react"
import type { Marca } from "@/api/productos"

interface MarcaFormProps {
    marca?: Marca | null
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
                    {isEditing ? "Actualizar" : "Crear"} Marca
                </>
            )}
        </Button>
    )
}

export default function MarcaForm({ marca, onSuccess, onCancel }: MarcaFormProps) {
    const { dark } = useAdminTheme()
    const initialState = { success: false, error: null }
    const action = marca?.id ? updateMarcaAction : createMarcaAction
    const [state, formAction] = useActionState(action, initialState)

    useEffect(() => {
        if (state.success) {
            onSuccess()
        }
    }, [state.success, onSuccess])

    return (
        <form action={formAction} className="space-y-4">
            {/* Hidden field for ID when editing */}
            {marca?.id && <input type="hidden" name="id" value={marca.id} />}

            <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                    {marca ? "Editar Marca" : "Nueva Marca"}
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
                    label="Nombre de la marca *"
                    name="nombre"
                    placeholder="Ej: Samsung, LG, Whirlpool"
                    defaultValue={marca?.nombre || ""}
                    required
                />
                {state.error && typeof state.error === 'object' && state.error.nombre?._errors?.length > 0 && (
                    <p className={`text-sm mt-1 ${dark ? 'text-red-400' : 'text-red-500'}`}>{state.error.nombre._errors[0]}</p>
                )}
            </div>

            <div>
                <Input
                    label="País de origen"
                    name="pais_origen"
                    placeholder="Ej: Corea del Sur, Estados Unidos"
                    defaultValue={marca?.pais_origen || ""}
                />
            </div>

            <ImageUpload
                label="Logo de la marca"
                name="logo"
                currentImage={marca?.logo}
            />

            <div className="flex gap-2 pt-4">
                <SubmitButton isEditing={!!marca?.id} />
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
