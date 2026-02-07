"use client"

import { useState, useEffect, useRef, startTransition } from "react"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { Button } from "@/components/ui/forms/Button"
import { Star, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { createComentarioAction, deleteComentarioAction } from "@/actions/comentarios"
import { getComentariosProductoClient } from "@/api/productos-client"
import { type ComentarioProducto } from "@/api/productos"
import { checkAuthentication } from "@/lib/cookies"
import { getCookieValue } from "@/lib/cookies"

interface ProductCommentsProps {
    productId: number
}

export default function ProductComments({ productId }: ProductCommentsProps) {
    const router = useRouter()
    const [comentarios, setComentarios] = useState<ComentarioProducto[]>([])
    const [allComentarios, setAllComentarios] = useState<ComentarioProducto[]>([])
    const [showAllComentarios, setShowAllComentarios] = useState(false)
    const [isLoadingComentarios, setIsLoadingComentarios] = useState(false)
    const [userRating, setUserRating] = useState(0)
    const [reviewText, setReviewText] = useState("")
    const [isMounted, setIsMounted] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [currentUsername, setCurrentUsername] = useState<string | null>(null)
    
    const [formState, formAction, isPending] = useActionState(createComentarioAction, null)
    const hasProcessedFormState = useRef(false)

    // Inicializar estado del cliente
    useEffect(() => {
        setIsMounted(true)
        setIsAuthenticated(checkAuthentication())
        setCurrentUsername(getCookieValue('username'))
    }, [])

    // Cargar comentarios al montar
    useEffect(() => {
        let isMounted = true
        
        const loadComentarios = async () => {
            if (!productId) return
            
            setIsLoadingComentarios(true)
            try {
                const allComentarios = await getComentariosProductoClient(productId)
                
                if (isMounted) {
                    setAllComentarios(allComentarios)
                    setComentarios(allComentarios.slice(0, 5))
                }
            } catch (error) {
                if (isMounted) {
                    setComentarios([])
                    setAllComentarios([])
                }
            } finally {
                if (isMounted) {
                    setIsLoadingComentarios(false)
                }
            }
        }

        loadComentarios()
        
        return () => {
            isMounted = false
        }
    }, [productId])

    // Manejar resultado del formulario (solo una vez por cambio de formState)
    useEffect(() => {
        if (!formState || hasProcessedFormState.current) return
        
        hasProcessedFormState.current = true
        
        if (formState.success) {
            toast.success("¡Gracias por tu opinión!", {
                style: { background: "#0A3981", color: "#fff" },
            })
            setReviewText("")
            setUserRating(0)
            
            // Recargar comentarios después de un breve delay
            setTimeout(async () => {
                const allComentarios = await getComentariosProductoClient(productId)
                setAllComentarios(allComentarios)
                setComentarios(allComentarios.slice(0, 5))
                hasProcessedFormState.current = false
            }, 500)
        } else {
            toast.error(formState.error || 'Error al publicar el comentario', {
                style: { background: "#dc2626", color: "#fff" },
            })
            hasProcessedFormState.current = false
        }
    }, [formState, productId])

    // Resetear el flag cuando formState cambia
    useEffect(() => {
        hasProcessedFormState.current = false
    }, [formState])

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (!reviewText.trim()) {
            toast.error('Por favor escribe un comentario', {
                style: { background: "#dc2626", color: "#fff" },
            })
            return
        }

        if (userRating === 0) {
            toast.error('Por favor selecciona una calificación', {
                style: { background: "#dc2626", color: "#fff" },
            })
            return
        }

        const formData = new FormData()
        formData.append('refaccionId', String(productId))
        formData.append('calificacion', String(userRating))
        formData.append('comentario', reviewText.trim())
        
        // Usar startTransition para envolver la llamada a formAction
        startTransition(() => {
            formAction(formData)
        })
    }

    const handleDeleteComentario = async (comentarioId: number, usuarioId: number) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
            return
        }

        try {
            const result = await deleteComentarioAction(comentarioId, usuarioId)
            
            if (result.success) {
                toast.success("Comentario eliminado", {
                    style: { background: "#0A3981", color: "#fff" },
                })
                
                // Recargar comentarios
                setTimeout(async () => {
                    const allComentarios = await getComentariosProductoClient(productId)
                    setAllComentarios(allComentarios)
                    setComentarios(allComentarios.slice(0, 5))
                }, 300)
            } else {
                toast.error(result.error || 'Error al eliminar el comentario', {
                    style: { background: "#dc2626", color: "#fff" },
                })
            }
        } catch (error) {
            toast.error('Error al eliminar el comentario', {
                style: { background: "#dc2626", color: "#fff" },
            })
        }
    }

    const renderStars = (rating: number, interactive = false) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={18}
                        className={`${
                            star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                        } ${
                            interactive
                                ? "cursor-pointer hover:scale-110 transition-transform"
                                : ""
                        }`}
                        onClick={() => interactive && setUserRating(star)}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-[#0A3981] mb-4">
                Opiniones
            </h3>

            {/* Formulario de review */}
            <div className="mb-6 bg-[#D4EBF8]/20 p-4 rounded-xl">
                {!isMounted || !isAuthenticated ? (
                    <div className="text-center py-4">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                            Inicia sesión para escribir una opinión
                        </p>
                        <Button
                            className="w-full bg-[#1F509A] text-white text-xs py-2 h-auto"
                            onClick={() => router.push('/cuenta/login')}
                        >
                            Iniciar Sesión
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleFormSubmit}>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Escribe una opinión
                        </p>
                        <div className="mb-3">
                            {renderStars(userRating, true)}
                        </div>
                        <textarea
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#1F509A] focus:border-transparent outline-none"
                            rows={3}
                            placeholder="¿Qué te pareció el producto?"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            className="w-full mt-2 bg-[#1F509A] text-white text-xs py-2 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!reviewText.trim() || userRating === 0 || isPending}
                        >
                            {isPending ? 'Publicando...' : 'Publicar Opinión'}
                        </Button>
                    </form>
                )}
            </div>

            {/* Lista de Reviews */}
            <div className="space-y-4">
                {isLoadingComentarios ? (
                    <div className="text-center py-4">
                        <p className="text-sm text-gray-500">Cargando comentarios...</p>
                    </div>
                ) : (() => {
                    const comentariosToShow = showAllComentarios ? allComentarios : comentarios
                    
                    if (comentariosToShow.length === 0) {
                        return (
                            <div className="text-center py-4">
                                <p className="text-sm text-gray-500">Aún no hay comentarios. ¡Sé el primero en opinar!</p>
                            </div>
                        )
                    }
                    
                    return (
                        <>
                            {comentariosToShow.map((comentario, index) => {
                                const fecha = comentario.created_at 
                                    ? new Date(comentario.created_at)
                                    : null
                                const fechaTexto = fecha
                                    ? fecha.toLocaleDateString('es-MX', { 
                                        year: 'numeric', 
                                        month: 'short', 
                                        day: 'numeric' 
                                    })
                                    : 'Fecha no disponible'
                                
                                return (
                                    <div
                                        key={comentario.id || `comentario-${index}`}
                                        className="border-b border-gray-100 pb-4 last:border-0 relative group"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold text-gray-900 text-sm">
                                                {comentario.usuario_nombre || 'Usuario'}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {/* Botón de eliminar - solo visible si el usuario es el propietario */}
                                                {isAuthenticated && 
                                                 currentUsername && 
                                                 comentario.usuario_nombre === currentUsername && (
                                                    <button
                                                        onClick={() => comentario.id && comentario.usuario && handleDeleteComentario(comentario.id, comentario.usuario)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-red-500 hover:text-red-700"
                                                        title="Eliminar comentario"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                                <span className="text-xs text-gray-400">
                                                    {fechaTexto}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            {renderStars(comentario.calificacion || 0)}
                                        </div>
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                            {comentario.comentario || 'Sin comentario'}
                                        </p>
                                    </div>
                                )
                            })}
                            
                            {!showAllComentarios && allComentarios.length > 5 && (
                                <div className="pt-4">
                                    <Button
                                        variant="outline"
                                        className="w-full text-sm py-2 border-[#1F509A] text-[#1F509A] hover:bg-[#D4EBF8]/20"
                                        onClick={() => setShowAllComentarios(true)}
                                    >
                                        Ver todos los comentarios ({allComentarios.length})
                                    </Button>
                                </div>
                            )}
                            
                            {showAllComentarios && allComentarios.length > 5 && (
                                <div className="pt-4">
                                    <Button
                                        variant="outline"
                                        className="w-full text-sm py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                                        onClick={() => setShowAllComentarios(false)}
                                    >
                                        Mostrar menos
                                    </Button>
                                </div>
                            )}
                        </>
                    )
                })()}
            </div>
        </div>
    )
}
