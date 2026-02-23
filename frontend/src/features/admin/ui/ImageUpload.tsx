"use client"

import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"
import Image from "next/image"

interface ImageUploadProps {
    label: string
    name: string
    currentImage?: string
    onImageChange?: (file: File | null) => void
    required?: boolean
}

export function ImageUpload({ 
    label, 
    name, 
    currentImage, 
    onImageChange,
    required = false 
}: ImageUploadProps) {
    const { dark } = useAdminTheme()
    const [preview, setPreview] = useState<string>(currentImage || "")
    const [fileName, setFileName] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validar que sea una imagen
            if (!file.type.startsWith('image/')) {
                alert('Por favor selecciona un archivo de imagen válido')
                return
            }

            // Validar tamaño (máx 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('La imagen no debe superar 5MB')
                return
            }

            setFileName(file.name)
            
            // Crear preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)

            // Notificar al padre si hay callback
            if (onImageChange) {
                onImageChange(file)
            }
        }
    }

    const handleRemove = () => {
        setPreview("")
        setFileName("")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        if (onImageChange) {
            onImageChange(null)
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="space-y-2">
            <label className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className={`relative rounded-xl border-2 border-dashed transition-colors ${
                dark 
                    ? 'border-slate-700 bg-slate-800/50 hover:border-slate-600' 
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            }`}>
                <input
                    ref={fileInputRef}
                    type="file"
                    name={name}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required={required && !preview}
                />

                {preview ? (
                    <div className="relative p-4">
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className={`absolute top-6 right-6 rounded-full p-2 shadow-lg transition ${
                                dark 
                                    ? 'bg-red-500/90 hover:bg-red-600 text-white' 
                                    : 'bg-red-500 hover:bg-red-600 text-white'
                            }`}
                        >
                            <X className="h-4 w-4" />
                        </button>
                        {fileName && (
                            <p className={`mt-2 text-sm truncate ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                                {fileName}
                            </p>
                        )}
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={handleClick}
                        className="w-full p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition"
                    >
                        <div className={`rounded-full p-4 ${
                            dark ? 'bg-slate-700/50' : 'bg-gray-200'
                        }`}>
                            <Upload className={`h-6 w-6 ${dark ? 'text-slate-400' : 'text-gray-500'}`} />
                        </div>
                        <div className="text-center">
                            <p className={`text-sm font-medium ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                Haz clic para seleccionar una imagen
                            </p>
                            <p className={`text-xs mt-1 ${dark ? 'text-slate-500' : 'text-gray-500'}`}>
                                PNG, JPG, WEBP hasta 5MB
                            </p>
                        </div>
                    </button>
                )}
            </div>

            {!preview && currentImage && (
                <div className="flex items-center gap-2 text-xs text-blue-500">
                    <ImageIcon className="h-4 w-4" />
                    <span>Imagen actual guardada</span>
                </div>
            )}
        </div>
    )
}

