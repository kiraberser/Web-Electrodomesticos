// @ts-nocheck - React 19 useActionState typing issue
"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/admin/ui/Button"
import { Input } from "@/components/admin/ui/Input"
import { ImageUpload } from "@/components/admin/ui/ImageUpload"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import { createProveedorAction, updateProveedorAction } from "@/actions/productos"
import { X, Plus } from "lucide-react"
import type { Proveedor } from "@/api/productos"

interface ProveedorFormProps {
    proveedor?: Proveedor | null
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
                    {isEditing ? "Actualizar" : "Crear"} Proveedor
                </>
            )}
        </Button>
    )
}

export default function ProveedorForm({ proveedor, onSuccess, onCancel }: ProveedorFormProps) {
    const { dark } = useAdminTheme()
    const initialState = { success: false, error: null }
    const action = proveedor?.id ? updateProveedorAction : createProveedorAction
    const [state, formAction] = useActionState(action, initialState)

    useEffect(() => {
        if (state.success) {
            onSuccess()
        }
    }, [state.success, onSuccess])

    return (
        <form action={formAction} className="space-y-4">
            {/* Hidden field for ID when editing */}
            {proveedor?.id && <input type="hidden" name="id" value={proveedor.id} />}

            <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                    {proveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
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

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Input
                        label="Nombre del proveedor *"
                        name="nombre"
                        placeholder="Ej: Distribuidora ABC"
                        defaultValue={proveedor?.nombre || ""}
                        required
                    />
                    {state.error && typeof state.error === 'object' && state.error.nombre?._errors?.length > 0 && (
                        <p className={`text-sm mt-1 ${dark ? 'text-red-400' : 'text-red-500'}`}>{state.error.nombre._errors[0]}</p>
                    )}
                </div>

                <div>
                    <Input
                        label="Persona de contacto *"
                        name="contacto"
                        placeholder="Ej: Juan Pérez"
                        defaultValue={proveedor?.contacto || ""}
                        required
                    />
                    {state.error && typeof state.error === 'object' && state.error.contacto?._errors?.length > 0 && (
                        <p className={`text-sm mt-1 ${dark ? 'text-red-400' : 'text-red-500'}`}>{state.error.contacto._errors[0]}</p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Input
                        label="Teléfono *"
                        type="tel"
                        name="telefono"
                        placeholder="Ej: +52 123 456 7890"
                        defaultValue={proveedor?.telefono || ""}
                        required
                    />
                    {state.error && typeof state.error === 'object' && state.error.telefono?._errors?.length > 0 && (
                        <p className={`text-sm mt-1 ${dark ? 'text-red-400' : 'text-red-500'}`}>{state.error.telefono._errors[0]}</p>
                    )}
                </div>

                <div>
                    <Input
                        label="Correo electrónico *"
                        type="email"
                        name="correo_electronico"
                        placeholder="contacto@proveedor.com"
                        defaultValue={proveedor?.correo_electronico || ""}
                        required
                    />
                    {state.error && typeof state.error === 'object' && state.error.correo_electronico?._errors?.length > 0 && (
                        <p className={`text-sm mt-1 ${dark ? 'text-red-400' : 'text-red-500'}`}>{state.error.correo_electronico._errors[0]}</p>
                    )}
                </div>
            </div>

            <div className="space-y-1.5">
                <label className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                    Dirección *
                </label>
                <textarea
                    name="direccion"
                    placeholder="Dirección completa del proveedor"
                    rows={3}
                    defaultValue={proveedor?.direccion || ""}
                    required
                    className={`flex min-h-[60px] w-full rounded-md border px-3 py-2 text-base shadow-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                        dark 
                            ? 'bg-slate-800 border-slate-700 text-gray-200 placeholder:text-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                    }`}
                />
                {state.error && typeof state.error === 'object' && state.error.direccion?._errors?.length > 0 && (
                    <p className={`text-sm mt-1 ${dark ? 'text-red-400' : 'text-red-500'}`}>{state.error.direccion._errors[0]}</p>
                )}
            </div>

            <ImageUpload
                label="Logo del proveedor"
                name="logo"
                currentImage={proveedor?.logo}
            />

            <div className="flex gap-2 pt-4">
                <SubmitButton isEditing={!!proveedor?.id} />
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
