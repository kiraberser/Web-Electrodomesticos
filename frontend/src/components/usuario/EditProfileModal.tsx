// @ts-nocheck - React 19 useActionState typing issue
"use client"

import type React from "react"
import { useState, useRef, useEffect, useActionState, useCallback } from "react"
import { useFormStatus } from "react-dom"
import { X, Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/forms/Button"
import { Input } from "@/components/ui/forms/InputField"
import { Label } from "@/components/ui/forms/Label"
import { Textarea } from "@/components/ui/display/Textarea"
import type { UserProfile } from "@/types/user"
import { updateUserProfileAction, type ActionState } from "@/actions/auth"
import { useRouter } from "next/navigation"

interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
    user: UserProfile
    onSuccess?: (updatedUser: UserProfile) => void
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

function SubmitButton() {
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
                "Guardar Cambios"
            )}
        </Button>
    )
}

export function EditProfileModal({
    isOpen,
    onClose,
    user,
    onSuccess,
}: EditProfileModalProps) {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(user.avatar)

    const initialState: ActionState = { success: false, error: null }
    const [state, formAction] = useActionState<ActionState, FormData>(updateUserProfileAction, initialState)

    // Reset preview when modal opens/closes or user changes
    useEffect(() => {
        if (isOpen) {
            setPreviewAvatar(user.avatar)
        }
    }, [isOpen, user])

    // Handle success - usando useRef para evitar múltiples ejecuciones
    const hasHandledSuccess = useRef(false)
    
    useEffect(() => {
        if (state.success && state.data && !hasHandledSuccess.current) {
            hasHandledSuccess.current = true
            
            // Call success callback
            if (onSuccess) {
                onSuccess(state.data as UserProfile)
            }
            
            // Close modal after a short delay to show success message
            setTimeout(() => {
                onClose()
            }, 1500)
        }
        
        // Reset flag when modal closes or opens
        if (!isOpen) {
            hasHandledSuccess.current = false
        }
    }, [state.success, state.data, onSuccess, onClose, isOpen])

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                return
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                return
            }

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewAvatar(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveAvatar = () => {
        setPreviewAvatar(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-[#0A3981]">Editar Perfil</h2>
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
                            <span>Perfil actualizado exitosamente</span>
                        </div>
                    )}

                    {/* General Error */}
                    {state.error && typeof state.error === 'string' && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
                            <AlertCircle className="w-5 h-5" />
                            <span>{state.error}</span>
                        </div>
                    )}

                    {/* Avatar Upload Section */}
                    <div className="mb-6">
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Foto de Perfil
                        </Label>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="h-20 w-20 rounded-full border-4 border-white bg-[#0A3981] flex items-center justify-center text-white text-xl font-bold shadow-md overflow-hidden">
                                    {previewAvatar ? (
                                        <img
                                            src={previewAvatar}
                                            alt="Avatar preview"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span>
                                            {user.first_name?.[0] || user.username[0]}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    name="avatar"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                    id="avatar-upload"
                                    disabled={state.success}
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors text-sm font-medium text-gray-700"
                                >
                                    <Upload className="w-4 h-4" />
                                    {previewAvatar ? "Cambiar foto" : "Subir foto"}
                                </label>
                                {previewAvatar && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveAvatar}
                                        className="text-sm text-red-600 hover:text-red-700 font-medium text-left"
                                        disabled={state.success}
                                    >
                                        Eliminar foto
                                    </button>
                                )}
                            </div>
                        </div>
                        {isValidationError(state.error) && state.error.avatar?._errors?.length > 0 && (
                            <p className="mt-2 text-sm text-red-600">{state.error.avatar._errors[0]}</p>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                            Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* First Name */}
                        <div>
                            <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                                Nombre
                            </Label>
                            <Input
                                id="first_name"
                                name="first_name"
                                defaultValue={user.first_name || ""}
                                className="mt-1"
                                disabled={state.success}
                            />
                            {isValidationError(state.error) && state.error.first_name?._errors?.length > 0 && (
                                <p className="mt-1 text-sm text-red-600">{state.error.first_name._errors[0]}</p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                                Apellido
                            </Label>
                            <Input
                                id="last_name"
                                name="last_name"
                                defaultValue={user.last_name || ""}
                                className="mt-1"
                                disabled={state.success}
                            />
                            {isValidationError(state.error) && state.error.last_name?._errors?.length > 0 && (
                                <p className="mt-1 text-sm text-red-600">{state.error.last_name._errors[0]}</p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Correo Electrónico *
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={user.email || ""}
                            className="mt-1"
                            required
                            disabled={state.success}
                        />
                        {isValidationError(state.error) && state.error.email?._errors?.length > 0 && (
                            <p className="mt-1 text-sm text-red-600">{state.error.email._errors[0]}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                            Teléfono
                        </Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            defaultValue={user.phone || ""}
                            className="mt-1"
                            disabled={state.success}
                        />
                        {isValidationError(state.error) && state.error.phone?._errors?.length > 0 && (
                            <p className="mt-1 text-sm text-red-600">{state.error.phone._errors[0]}</p>
                        )}
                    </div>

                    {/* Address Section */}
                    <div className="mb-6">
                        <Label className="text-sm font-medium text-gray-700 mb-3 block">
                            Dirección de Envío
                        </Label>
                        
                        {/* Street and Number */}
                        <div className="mb-4">
                            <Label htmlFor="address_street" className="text-sm font-medium text-gray-700">
                                Calle y Número
                            </Label>
                            <Input
                                id="address_street"
                                name="address_street"
                                defaultValue={user.address_street || ""}
                                className="mt-1"
                                placeholder="Ej: Av. Insurgentes Sur 123"
                                disabled={state.success}
                            />
                            {isValidationError(state.error) && state.error.address_street?._errors?.length > 0 && (
                                <p className="mt-1 text-sm text-red-600">{state.error.address_street._errors[0]}</p>
                            )}
                        </div>

                        {/* Colony and Postal Code */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <Label htmlFor="address_colony" className="text-sm font-medium text-gray-700">
                                    Colonia
                                </Label>
                                <Input
                                    id="address_colony"
                                    name="address_colony"
                                    defaultValue={user.address_colony || ""}
                                    className="mt-1"
                                    placeholder="Ej: Del Valle"
                                    disabled={state.success}
                                />
                                {isValidationError(state.error) && state.error.address_colony?._errors?.length > 0 && (
                                    <p className="mt-1 text-sm text-red-600">{state.error.address_colony._errors[0]}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="address_postal_code" className="text-sm font-medium text-gray-700">
                                    Código Postal
                                </Label>
                                <Input
                                    id="address_postal_code"
                                    name="address_postal_code"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]{5}"
                                    defaultValue={user.address_postal_code || ""}
                                    className="mt-1"
                                    placeholder="12345"
                                    maxLength={5}
                                    disabled={state.success}
                                />
                                {isValidationError(state.error) && state.error.address_postal_code?._errors?.length > 0 && (
                                    <p className="mt-1 text-sm text-red-600">{state.error.address_postal_code._errors[0]}</p>
                                )}
                            </div>
                        </div>

                        {/* City and State */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <Label htmlFor="address_city" className="text-sm font-medium text-gray-700">
                                    Ciudad
                                </Label>
                                <Input
                                    id="address_city"
                                    name="address_city"
                                    defaultValue={user.address_city || ""}
                                    className="mt-1"
                                    placeholder="Ej: Ciudad de México"
                                    disabled={state.success}
                                />
                                {isValidationError(state.error) && state.error.address_city?._errors?.length > 0 && (
                                    <p className="mt-1 text-sm text-red-600">{state.error.address_city._errors[0]}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="address_state" className="text-sm font-medium text-gray-700">
                                    Estado
                                </Label>
                                <Input
                                    id="address_state"
                                    name="address_state"
                                    defaultValue={user.address_state || ""}
                                    className="mt-1"
                                    placeholder="Ej: Ciudad de México"
                                    disabled={state.success}
                                />
                                {isValidationError(state.error) && state.error.address_state?._errors?.length > 0 && (
                                    <p className="mt-1 text-sm text-red-600">{state.error.address_state._errors[0]}</p>
                                )}
                            </div>
                        </div>

                        {/* References */}
                        <div>
                            <Label htmlFor="address_references" className="text-sm font-medium text-gray-700">
                                Referencias Adicionales
                            </Label>
                            <Textarea
                                id="address_references"
                                name="address_references"
                                defaultValue={user.address_references || ""}
                                className="mt-1"
                                rows={2}
                                placeholder="Ej: Entre calles X y Y, edificio azul, piso 3, departamento 5"
                                disabled={state.success}
                            />
                            {isValidationError(state.error) && state.error.address_references?._errors?.length > 0 && (
                                <p className="mt-1 text-sm text-red-600">{state.error.address_references._errors[0]}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Información adicional que ayude al repartidor a encontrar tu domicilio
                            </p>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="mb-6">
                        <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                            Biografía
                        </Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            defaultValue={user.bio || ""}
                            className="mt-1"
                            rows={4}
                            placeholder="Cuéntanos sobre ti..."
                            disabled={state.success}
                        />
                        {isValidationError(state.error) && state.error.bio?._errors?.length > 0 && (
                            <p className="mt-1 text-sm text-red-600">{state.error.bio._errors[0]}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={state.success}
                        >
                            Cancelar
                        </Button>
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    )
}
