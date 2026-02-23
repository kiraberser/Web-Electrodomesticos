"use client"

import { useEffect, useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/features/admin/ui/Button"
import { Input } from "@/features/admin/ui/Input"
import { Select } from "@/features/admin/ui/Select"
import { ImageUpload } from "@/features/admin/ui/ImageUpload"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"
import {
    createRefaccionAction,
    updateRefaccionAction,
} from "@/features/catalog/admin-actions"
import {
    type Refaccion,
    type Categoria,
    type Proveedor
} from "@/features/catalog/api"

import { X, Plus } from "lucide-react"

interface RefaccionFormProps {
    refaccion?: Refaccion | null
    onSuccess: () => void
    onCancel: () => void
    categorias?: Categoria[]
    proveedores?: Proveedor[]
}

const ESTADO_OPTIONS = [
    { value: 'NVO', label: 'Nuevo' },
    { value: 'UBS', label: 'Usado - Buen Estado' },
    { value: 'REC', label: 'Reacondicionado' },
]

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
                    {isEditing ? "Actualizar" : "Crear"} Refacción
                </>
            )}
        </Button>
    )
}

export default function RefaccionForm({ 
    refaccion, 
    onSuccess, 
    onCancel, 
    categorias = [], 
    proveedores = [] 
}: RefaccionFormProps) {
    const initialState = { success: false, error: null }
    const { dark } = useAdminTheme()
    const action = refaccion?.id ? updateRefaccionAction : createRefaccionAction
    const [state, formAction] = useActionState(action, initialState)

    useEffect(() => {
        if (state.success) {
            onSuccess()
        }
    }, [state.success, onSuccess])

    return (
        <form action={formAction} className="space-y-4">
            {/* Hidden field for ID when editing */}
            {refaccion?.id && <input type="hidden" name="id" value={refaccion.id} />}

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    {refaccion ? "Editar Refacción" : "Nueva Refacción"}
                </h3>
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Global error message */}
            {state.error && typeof state.error === 'string' && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
                    {state.error}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Input
                        label="Código de parte *"
                        name="codigo_parte"
                        placeholder="Ej: WP12345"
                        defaultValue={refaccion?.codigo_parte || ""}
                        required
                    />
                    {state.error && typeof state.error === 'object' && state.error.codigo_parte?._errors?.length > 0 && (
                        <p className="text-red-500 text-sm mt-1">{state.error.codigo_parte._errors[0]}</p>
                    )}
                </div>

                <div>
                    <Input
                        label="Nombre *"
                        name="nombre"
                        placeholder="Ej: Compresor de refrigerador"
                        defaultValue={refaccion?.nombre || ""}
                        required
                    />
                    {state.error && typeof state.error === 'object' && state.error.nombre?._errors?.length > 0 && (
                        <p className="text-red-500 text-sm mt-1">{state.error.nombre._errors[0]}</p>
                    )}
                </div>
            </div>

            <div className="space-y-1.5">
                <label className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                    Descripción
                </label>
                <textarea
                    name="descripcion"
                    placeholder="Descripción detallada de la refacción"
                    defaultValue={refaccion?.descripcion || ""}
                    rows={2}
                    className={`flex min-h-[60px] w-full rounded-md border px-3 py-2 text-base shadow-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                        dark 
                            ? 'bg-slate-800 border-slate-700 text-gray-200 placeholder:text-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                    }`}
                />
            </div>

            <ImageUpload
                label="Imagen de la refacción"
                name="imagen"
                currentImage={refaccion?.imagen}
            />

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Input
                        label="Marca *"
                        name="marca"
                        placeholder="Ej: Samsung, LG, Whirlpool"
                        defaultValue={refaccion?.marca || ""}
                        required
                    />
                    {state.error && typeof state.error === 'object' && state.error.marca?._errors?.length > 0 && (
                        <p className="text-red-500 text-sm mt-1">{state.error.marca._errors[0]}</p>
                    )}
                </div>

                <div>
                    <Select
                        label="Categoría *"
                        name="categoria"
                        defaultValue={refaccion?.categoria}
                        required
                    >
                        <option className={dark ? 'text-gray-200 bg-slate-800' : 'text-gray-800 bg-white'} value="">Selecciona una categoría</option>
                        {categorias.map((cat) => (
                            <option className={dark ? 'text-gray-200 bg-slate-800' : 'text-gray-800 bg-white   '}     key={cat.id} value={cat.id}>
                                {cat.nombre}
                            </option>
                        ))}
                    </Select>
                    {state.error && typeof state.error === 'object' && state.error.categoria?._errors?.length > 0 && (
                        <p className="text-red-500 text-sm mt-1">{state.error.categoria._errors[0]}</p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <Input
                        label="Precio *"
                        type="number"
                        name="precio"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        defaultValue={refaccion?.precio || ""}
                        required
                    />
                    {state.error && typeof state.error === 'object' && state.error.precio?._errors?.length > 0 && (
                        <p className="text-red-500 text-sm mt-1">{state.error.precio._errors[0]}</p>
                    )}
                </div>

                <div>
                    <Input
                        label="Existencias *"
                        type="number"
                        name="existencias"
                        min="0"
                        placeholder="0"
                        defaultValue={refaccion?.existencias || ""}
                        required
                    />
                    {state.error && typeof state.error === 'object' && state.error.existencias?._errors?.length > 0 && (
                        <p className="text-red-500 text-sm mt-1">{state.error.existencias._errors[0]}</p>
                    )}
                </div>

                <div>
                    <Select
                        label="Estado *"
                        name="estado"
                        defaultValue={refaccion?.estado || 'NVO'}
                        required
                    >
                        {ESTADO_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </Select>
                    {state.error && typeof state.error === 'object' && state.error.estado?._errors?.length > 0 && (
                        <p className={`text-sm mt-1 ${dark ? 'text-red-400' : 'text-red-500'}`}>{state.error.estado._errors[0]}</p>
                    )}
                </div>
            </div>

            <div>
                <Select
                    label="Proveedor (Opcional)"
                    name="proveedor"
                    defaultValue={refaccion?.proveedor || ""}
                >
                    <option value="">Sin proveedor asignado</option>
                    {proveedores.map((prov) => (
                        <option key={prov.id} value={prov.id}>
                            {prov.nombre}
                        </option>
                    ))}
                </Select>
            </div>

            <div className="space-y-1.5">
                <label className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                    Compatibilidad *
                </label>
                <textarea
                    name="compatibilidad"
                    placeholder="Modelos de electrodomésticos compatibles"
                    rows={2}
                    defaultValue={refaccion?.compatibilidad || ""}
                    required
                    className={`flex min-h-[60px] w-full rounded-md border px-3 py-2 text-base shadow-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                        dark 
                            ? 'bg-slate-800 border-slate-700 text-gray-200 placeholder:text-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                    }`}
                />
                {state.error && typeof state.error === 'object' && state.error.compatibilidad?._errors?.length > 0 && (
                    <p className={`text-sm mt-1 ${dark ? 'text-red-400' : 'text-red-500'}`}>{state.error.compatibilidad._errors[0]}</p>
                )}
            </div>

            <div className="flex gap-2 pt-4">
                <SubmitButton isEditing={!!refaccion?.id} />
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
