// @ts-nocheck - React 19 useActionState typing issue
"use client"

import type React from "react"
import { useState, useEffect, useActionState, useRef } from "react"
import { useFormStatus } from "react-dom"
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/forms/Button"
import { Input } from "@/components/ui/forms/InputField"
import { Label } from "@/components/ui/forms/Label"
import { Textarea } from "@/components/ui/display/Textarea"
import type { Direccion } from "@/types/user"
import { createDireccionAction, updateDireccionAction, type ActionState } from "@/actions/auth"

interface DireccionModalProps {
    isOpen: boolean
    onClose: () => void
    direccion?: Direccion | null
    onSuccess?: (direccion: Direccion) => void
}

// Type guard para verificar si el error es un objeto de validación
function isValidationError(error: unknown): error is Record<string, { _errors: string[] }> {
    return (
        error !== null &&
        typeof error === 'object' &&
        !Array.isArray(error) &&
        Object.values(error).every(
            (value) =>
                typeof value === 'object' &&
                value !== null &&
                '_errors' in value &&
                Array.isArray(value._errors)
        )
    )
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus()
    
    return (
        <Button
            type="submit"
            disabled={pending}
            className="bg-[#E38E49] hover:bg-[#d68340] text-white"
        >
            {pending ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                </>
            ) : (
                isEditing ? "Actualizar Dirección" : "Agregar Dirección"
            )}
        </Button>
    )
}

export function DireccionModal({
    isOpen,
    onClose,
    direccion,
    onSuccess,
}: DireccionModalProps) {
    const isEditing = !!direccion
    const initialState: ActionState = { success: false, error: null }
    
    // Usar diferentes acciones según si es creación o edición
    const createAction = (prevState: ActionState, formData: FormData) => 
        createDireccionAction(prevState, formData)
    
    const updateAction = (prevState: ActionState, formData: FormData) => 
        updateDireccionAction(direccion!.id, prevState, formData)
    
    const [state, formAction] = useActionState<ActionState, FormData>(
        isEditing ? updateAction : createAction,
        initialState
    )

    // Handle success
    const hasHandledSuccess = useRef(false)
    
    useEffect(() => {
        if (state.success && state.data && !hasHandledSuccess.current) {
            hasHandledSuccess.current = true
            
            if (onSuccess) {
                onSuccess(state.data as Direccion)
            }
            
            setTimeout(() => {
                onClose()
            }, 1500)
        }
        
        if (!isOpen) {
            hasHandledSuccess.current = false
        }
    }, [state.success, state.data, onSuccess, onClose, isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-[#0A3981]">
                        {isEditing ? "Editar Dirección" : "Agregar Nueva Dirección"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        disabled={state.success}
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <form action={formAction} className="flex-1 overflow-y-auto p-6">
                    {/* Success Message */}
                    {state.success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>
                                {isEditing 
                                    ? "Dirección actualizada exitosamente" 
                                    : "Dirección creada exitosamente"}
                            </span>
                        </div>
                    )}

                    {/* General Error */}
                    {state.error && typeof state.error === 'string' && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
                            <AlertCircle className="w-5 h-5" />
                            <span>{state.error}</span>
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Nombre */}
                        <div>
                            <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                                Nombre de la Dirección *
                            </Label>
                            <Input
                                id="nombre"
                                name="nombre"
                                defaultValue={direccion?.nombre || ""}
                                className="mt-1"
                                placeholder="Ej: Casa, Oficina, etc."
                                required
                                disabled={state.success}
                            />
                            {isValidationError(state.error) && state.error.nombre?._errors?.length > 0 && (
                                <p className="mt-1 text-sm text-red-600">{state.error.nombre._errors[0]}</p>
                            )}
                        </div>

                        {/* Street */}
                        <div>
                            <Label htmlFor="street" className="text-sm font-medium text-gray-700">
                                Calle y Número *
                            </Label>
                            <Input
                                id="street"
                                name="street"
                                defaultValue={direccion?.street || ""}
                                className="mt-1"
                                placeholder="Ej: Av. Insurgentes Sur 123"
                                required
                                disabled={state.success}
                            />
                            {isValidationError(state.error) && state.error.street?._errors?.length > 0 && (
                                <p className="mt-1 text-sm text-red-600">{state.error.street._errors[0]}</p>
                            )}
                        </div>

                        {/* Colony and Postal Code */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="colony" className="text-sm font-medium text-gray-700">
                                    Colonia *
                                </Label>
                                <Input
                                    id="colony"
                                    name="colony"
                                    defaultValue={direccion?.colony || ""}
                                    className="mt-1"
                                    placeholder="Ej: Del Valle"
                                    required
                                    disabled={state.success}
                                />
                                {isValidationError(state.error) && state.error.colony?._errors?.length > 0 && (
                                    <p className="mt-1 text-sm text-red-600">{state.error.colony._errors[0]}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="postal_code" className="text-sm font-medium text-gray-700">
                                    Código Postal *
                                </Label>
                                <Input
                                    id="postal_code"
                                    name="postal_code"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]{5}"
                                    defaultValue={direccion?.postal_code || ""}
                                    className="mt-1"
                                    placeholder="12345"
                                    maxLength={5}
                                    required
                                    disabled={state.success}
                                />
                                {isValidationError(state.error) && state.error.postal_code?._errors?.length > 0 && (
                                    <p className="mt-1 text-sm text-red-600">{state.error.postal_code._errors[0]}</p>
                                )}
                            </div>
                        </div>

                        {/* City and State */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                                    Ciudad *
                                </Label>
                                <Input
                                    id="city"
                                    name="city"
                                    defaultValue={direccion?.city || ""}
                                    className="mt-1"
                                    placeholder="Ej: Ciudad de México"
                                    required
                                    disabled={state.success}
                                />
                                {isValidationError(state.error) && state.error.city?._errors?.length > 0 && (
                                    <p className="mt-1 text-sm text-red-600">{state.error.city._errors[0]}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                                    Estado *
                                </Label>
                                <Input
                                    id="state"
                                    name="state"
                                    defaultValue={direccion?.state || ""}
                                    className="mt-1"
                                    placeholder="Ej: Ciudad de México"
                                    required
                                    disabled={state.success}
                                />
                                {isValidationError(state.error) && state.error.state?._errors?.length > 0 && (
                                    <p className="mt-1 text-sm text-red-600">{state.error.state._errors[0]}</p>
                                )}
                            </div>
                        </div>

                        {/* References */}
                        <div>
                            <Label htmlFor="references" className="text-sm font-medium text-gray-700">
                                Referencias Adicionales
                            </Label>
                            <Textarea
                                id="references"
                                name="references"
                                defaultValue={direccion?.references || ""}
                                className="mt-1"
                                rows={3}
                                placeholder="Ej: Entre calles X y Y, edificio azul, piso 3, departamento 5"
                                disabled={state.success}
                            />
                            {isValidationError(state.error) && state.error.references?._errors?.length > 0 && (
                                <p className="mt-1 text-sm text-red-600">{state.error.references._errors[0]}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Información adicional que ayude al repartidor a encontrar tu domicilio
                            </p>
                        </div>

                        {/* Is Primary */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_primary"
                                name="is_primary"
                                defaultChecked={direccion?.is_primary || false}
                                value="true"
                                className="w-4 h-4 text-[#E38E49] border-gray-300 rounded focus:ring-[#E38E49]"
                                disabled={state.success}
                            />
                            <Label htmlFor="is_primary" className="text-sm font-medium text-gray-700 cursor-pointer">
                                Marcar como dirección principal
                            </Label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={state.success}
                        >
                            Cancelar
                        </Button>
                        <SubmitButton isEditing={isEditing} />
                    </div>
                </form>
            </div>
        </div>
    )
}

