"use client"

import { useState, useCallback, useEffect } from "react"
import { Plus, MapPin } from "lucide-react"
import { Button } from "@/components/ui/forms/Button"
import { DireccionCard, DireccionModal } from "./"
import type { Direccion } from "@/types/user"
import { deleteDireccionAction, updateDireccionAction } from "@/actions/auth"
import { useRouter } from "next/navigation"

interface DireccionesListProps {
    direcciones: Direccion[]
}

export function DireccionesList({ direcciones: initialDirecciones }: DireccionesListProps) {
    const router = useRouter()
    const [direcciones, setDirecciones] = useState<Direccion[]>(initialDirecciones)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingDireccion, setEditingDireccion] = useState<Direccion | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    // Sincronizar direcciones cuando cambian desde el servidor
    useEffect(() => {
        setDirecciones(initialDirecciones)
    }, [initialDirecciones])

    const handleAddClick = useCallback(() => {
        setEditingDireccion(null)
        setIsModalOpen(true)
    }, [])

    const handleEditClick = useCallback((direccion: Direccion) => {
        setEditingDireccion(direccion)
        setIsModalOpen(true)
    }, [])

    const handleDeleteClick = useCallback(async (id: number) => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta dirección?")) {
            return
        }

        setDeletingId(id)
        try {
            const result = await deleteDireccionAction(id)
            if (result.success) {
                setDirecciones(prev => prev.filter(d => d.id !== id))
                router.refresh()
            } else {
                alert(result.error || "Error al eliminar la dirección")
            }
        } catch (error) {
            console.error("Error deleting direccion:", error)
            alert("Error al eliminar la dirección")
        } finally {
            setDeletingId(null)
        }
    }, [router])

    const handleSetPrimary = useCallback(async (id: number) => {
        const direccion = direcciones.find(d => d.id === id)
        if (!direccion) return

        // Optimistic update
        setDirecciones(prev => 
            prev.map(d => ({
                ...d,
                is_primary: d.id === id
            }))
        )

        try {
            // Crear una función wrapper para la acción
            const wrapperAction = async (prevState: { success: boolean; error: null }, formData: FormData) => {
                return updateDireccionAction(id, prevState, formData)
            }

            const formData = new FormData()
            formData.append("nombre", direccion.nombre)
            formData.append("street", direccion.street)
            formData.append("colony", direccion.colony)
            formData.append("city", direccion.city)
            formData.append("state", direccion.state)
            formData.append("postal_code", direccion.postal_code)
            if (direccion.references) {
                formData.append("references", direccion.references)
            }
            formData.append("is_primary", "true")

            const result = await wrapperAction({ success: false, error: null }, formData)
            if (result.success && result.data) {
                // Actualizar con los datos del servidor
                setDirecciones(prev => 
                    prev.map(d => d.id === id ? result.data as Direccion : { ...d, is_primary: false })
                )
                router.refresh()
            } else {
                // Revertir en caso de error
                setDirecciones(prev => 
                    prev.map(d => d.id === id ? direccion : d)
                )
                alert(result.error || "Error al establecer dirección principal")
            }
        } catch (error) {
            console.error("Error setting primary:", error)
            // Revertir en caso de error
            setDirecciones(prev => 
                prev.map(d => d.id === id ? direccion : d)
            )
            alert("Error al establecer dirección principal")
        }
    }, [direcciones, router])

    const handleModalSuccess = useCallback((direccion: Direccion) => {
        if (editingDireccion) {
            // Actualizar - si se marca como principal, desmarcar las demás
            setDirecciones(prev => {
                if (direccion.is_primary) {
                    return prev.map(d => 
                        d.id === direccion.id 
                            ? direccion 
                            : { ...d, is_primary: false }
                    )
                }
                return prev.map(d => d.id === direccion.id ? direccion : d)
            })
        } else {
            // Agregar nueva - si se marca como principal, desmarcar las demás
            setDirecciones(prev => {
                if (direccion.is_primary) {
                    return [
                        ...prev.map(d => ({ ...d, is_primary: false })),
                        direccion
                    ]
                }
                return [...prev, direccion]
            })
        }
        router.refresh()
    }, [editingDireccion, router])

    const canAddMore = direcciones.length < 3

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0A3981]">
                            Mis Direcciones
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Gestiona tus direcciones de envío ({direcciones.length}/3)
                        </p>
                    </div>
                    {canAddMore && (
                        <Button
                            type="button"
                            onClick={handleAddClick}
                            className="bg-[#E38E49] hover:bg-[#d68340] text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Dirección
                        </Button>
                    )}
                </div>

                {/* Direcciones List */}
                {direcciones.length === 0 ? (
                    <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                        <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No tienes direcciones guardadas
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Agrega una dirección para facilitar tus compras
                        </p>
                        {canAddMore && (
                            <Button
                                type="button"
                                onClick={handleAddClick}
                                className="bg-[#E38E49] hover:bg-[#d68340] text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar Primera Dirección
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {direcciones
                            .sort((a, b) => {
                                // Ordenar: principal primero, luego por fecha de creación
                                if (a.is_primary && !b.is_primary) return -1
                                if (!a.is_primary && b.is_primary) return 1
                                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                            })
                            .map((direccion) => (
                                <DireccionCard
                                    key={`direccion-${direccion.id}-${direccion.is_primary}`}
                                    direccion={direccion}
                                    onEdit={() => handleEditClick(direccion)}
                                    onDelete={() => handleDeleteClick(direccion.id)}
                                    onSetPrimary={direccion.is_primary ? undefined : () => handleSetPrimary(direccion.id)}
                                />
                            ))}
                        
                        {/* Add Card (si hay menos de 3) */}
                        {canAddMore && (
                            <button
                                type="button"
                                onClick={handleAddClick}
                                className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-[#E38E49] hover:bg-[#FFF8F3] transition-all flex flex-col items-center justify-center min-h-[200px]"
                            >
                                <div className="w-12 h-12 rounded-full bg-[#E38E49]/10 flex items-center justify-center mb-3">
                                    <Plus className="w-6 h-6 text-[#E38E49]" />
                                </div>
                                <p className="text-[#0A3981] font-semibold">
                                    Agregar Dirección
                                </p>
                            </button>
                        )}
                    </div>
                )}

                {/* Max Limit Message */}
                {!canAddMore && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                            Has alcanzado el límite máximo de 3 direcciones. Elimina una para agregar otra.
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
            <DireccionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingDireccion(null)
                }}
                direccion={editingDireccion}
                onSuccess={handleModalSuccess}
            />
        </>
    )
}

