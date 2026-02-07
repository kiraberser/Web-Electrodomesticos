"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { type Refaccion } from "@/api/productos";
import { type Brand, type Product, ProductType } from "@/data/products";
import CheckoutButton from "@/components/checkout/CheckoutButton";
import { agregarFavoritoAction, eliminarFavoritoAction } from "@/actions/favoritos";
import AuthRequiredModal from "@/components/favoritos/AuthRequiredModal";
import { checkAuthentication } from "@/lib/cookies";
import { addCartItemAction } from "@/actions/cart";
// Iconos modernos (reemplaza los anteriores si es necesario)
import {
    ArrowLeft,
    CheckCircle,
    CreditCard,
    Heart,
    MessageSquare,
    Share2,
    Shield,
    Star,
    Truck,
    Wrench,
    Zap,
    Plus,
    Minus,
    ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/forms/Button"; // Tu componente existente
import { Badge } from "@/components/ui/feedback/Badge";

interface Props {
    categoria: string;
    refaccion: Refaccion;
    initialIsFavorite?: boolean;
}


export default function ProductDetailClient({ categoria, refaccion, initialIsFavorite = false }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const { addItem, items, updateQuantity } = useCart();

    // Estados para interactividad local
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [showCheckout, setShowCheckout] = useState(false);
    // Inicializar isAuthenticated basado en cookies si estamos en el cliente
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        if (typeof window !== 'undefined') {
            return checkAuthentication();
        }
        return false;
    });
    const [isMounted, setIsMounted] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Ref para prevenir múltiples clicks simultáneos
    const isProcessingRef = useRef(false);
    
    // Cola de acciones pendientes de favoritos para sincronizar cuando cambie de pestaña
    // Usar sessionStorage para compartir entre componentes
    const STORAGE_KEY = 'pending_favorite_actions';
    const getPendingActions = (): Array<{ action: 'add' | 'remove'; refaccionId: number }> => {
        if (typeof window === 'undefined') return [];
        try {
            const stored = sessionStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    };
    const setPendingActions = (actions: Array<{ action: 'add' | 'remove'; refaccionId: number }>) => {
        if (typeof window === 'undefined') return;
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
        } catch {
            // Ignorar errores de storage
        }
    };
    const pendingFavoriteActionsRef = useRef<Array<{ action: 'add' | 'remove'; refaccionId: number }>>(getPendingActions());
    const isSyncingRef = useRef(false);
    
    // Sincronizar ref con sessionStorage
    useEffect(() => {
        pendingFavoriteActionsRef.current = getPendingActions();
    }, []);

    // Verificar autenticación solo en el cliente después del montaje
    useEffect(() => {
        setIsMounted(true);
        const authStatus = checkAuthentication();
        setIsAuthenticated(authStatus);
        
        // Si está autenticado, asegurarse de que el modal esté cerrado
        if (authStatus) {
            setShowAuthModal(false);
        }
    }, []);

    // Verificar autenticación cuando el usuario regresa de la pestaña de login
    useEffect(() => {
        if (!isMounted || !showAuthModal) return;

        const checkAuth = () => {
            const authStatus = checkAuthentication();
            if (authStatus) {
                setIsAuthenticated(true);
                setShowAuthModal(false);
            }
        };

        // Check auth when user returns from login tab/window
        window.addEventListener('focus', checkAuth);
        document.addEventListener('visibilitychange', checkAuth);

        return () => {
            window.removeEventListener('focus', checkAuth);
            document.removeEventListener('visibilitychange', checkAuth);
        };
    }, [showAuthModal, isMounted]);

    // Cerrar modal automáticamente si el usuario se autentica
    useEffect(() => {
        if (isMounted && showAuthModal && isAuthenticated) {
            setShowAuthModal(false);
        }
    }, [showAuthModal, isMounted, isAuthenticated]);

    // Función para sincronizar cambios pendientes
    const syncPendingActions = async () => {
        // Verificar autenticación antes de sincronizar
        if (!checkAuthentication()) {
            // Si no está autenticado, limpiar las acciones pendientes
            setPendingActions([]);
            pendingFavoriteActionsRef.current = [];
            return;
        }

        // Obtener acciones desde sessionStorage
        const actions = getPendingActions();
        if (actions.length === 0 || isSyncingRef.current) {
            return;
        }

        isSyncingRef.current = true;
        // Limpiar storage inmediatamente para evitar duplicados
        setPendingActions([]);
        pendingFavoriteActionsRef.current = [];

        try {
            for (const { action, refaccionId } of actions) {
                if (action === 'add') {
                    await agregarFavoritoAction(refaccionId);
                } else {
                    await eliminarFavoritoAction(refaccionId);
                }
            }
        } catch (error) {
            console.error('Error sincronizando favoritos:', error);
            // Re-agregar acciones fallidas a la cola solo si está autenticado
            if (checkAuthentication()) {
                const failedActions = [...actions, ...getPendingActions()];
                setPendingActions(failedActions);
                pendingFavoriteActionsRef.current = failedActions;
            }
        } finally {
            isSyncingRef.current = false;
        }
    };

    // Sincronizar cuando se navega a la página de favoritos
    useEffect(() => {
        if (pathname === '/cuenta/perfil/favoritos') {
            syncPendingActions();
        }
    }, [pathname]);

    // Sincronizar cambios pendientes cuando cambia la visibilidad de la pestaña
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Cuando la pestaña se oculta, sincronizar cambios pendientes
                syncPendingActions();
            }
        };

        const handleBeforeUnload = () => {
            // Sincronizar antes de salir de la página
            if (pendingFavoriteActionsRef.current.length > 0) {
                syncPendingActions();
            }
        };

        // Interceptar clicks en enlaces de favoritos
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a[href*="/cuenta/perfil/favoritos"]');
            if (link) {
                // Sincronizar antes de navegar
                syncPendingActions();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('click', handleClick, true); // Usar capture para interceptar antes

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('click', handleClick, true);
            // Sincronizar cualquier cambio pendiente al desmontar
            syncPendingActions();
        };
    }, []);

    // Transformar Refaccion a Product (Logica existente)
    const product: Product = useMemo(() => ({
        id: String(refaccion.id),
        slug: refaccion.codigo_parte,
        name: refaccion.nombre,
        price: Number(refaccion.precio),
        brand: refaccion.marca as Brand,
        type: refaccion.categoria_nombre as ProductType,
        category: categoria,
        image: refaccion.imagen || "/placeholder.svg?height=640&width=640",
        shortDescription: refaccion.descripcion || "",
        specs: [
            { label: "Marca", value: refaccion.marca },
            { label: "Código", value: refaccion.codigo_parte },
            { label: "Estado", value: refaccion.estado },
            ...(refaccion.compatibilidad
                ? [{ label: "Compatibilidad", value: refaccion.compatibilidad }]
                : []),
        ],
        inStock: refaccion.existencias > 0,
    }), [refaccion, categoria]);

    // Obtener cantidad actual del producto en el carrito
    const cartItemQuantity = useMemo(() => {
        const cartItem = items.find(item => item.id === product.id);
        return cartItem?.quantity || 0;
    }, [items, product.id]);

    // Lógica de Carrito con cantidad
    const handleAddToCart = async () => {
        const authStatus = checkAuthentication();
        if (!authStatus) {
            toast.error('Inicia sesión para agregar productos al carrito', {
                style: { background: "#dc2626", color: "#fff" },
            });
            router.push('/cuenta/login');
            return;
        }

        try {
            const refaccionId = Number(product.id) || refaccion.id;
            if (!refaccionId) {
                throw new Error("ID de producto inválido");
            }
            await addCartItemAction(refaccionId, quantity);
        } catch (error) {
            console.error("Error al sincronizar carrito:", error);
            toast.error('No se pudo agregar al carrito', {
                style: { background: "#dc2626", color: "#fff" },
            });
            return;
        }

        if (!product.inStock) {
            toast.error("Este producto no está disponible", {
                style: { background: "#dc2626", color: "#fff" },
            });
            return;
        }

        const existingItem = items.find(item => item.id === product.id);
        const stockDisponible = refaccion.existencias;
        
        if (existingItem) {
            // Si ya existe, validar que la cantidad total no exceda el stock
            const cantidadTotal = existingItem.quantity + quantity;
            
            if (cantidadTotal > stockDisponible) {
                const cantidadDisponible = stockDisponible - existingItem.quantity;
                if (cantidadDisponible <= 0) {
                    toast.error(`Ya tienes ${existingItem.quantity} unidad${existingItem.quantity > 1 ? 'es' : ''} en el carrito. Solo hay ${stockDisponible} disponible${stockDisponible > 1 ? 's' : ''}`, {
                        style: { background: "#dc2626", color: "#fff" },
                    });
                } else {
                    toast.error(`Solo puedes agregar ${cantidadDisponible} unidad${cantidadDisponible > 1 ? 'es' : ''} más. Ya tienes ${existingItem.quantity} en el carrito de ${stockDisponible} disponible${stockDisponible > 1 ? 's' : ''}`, {
                        style: { background: "#dc2626", color: "#fff" },
                    });
                }
                return;
            }
            
            // Si la validación pasa, actualizar cantidad
            updateQuantity(product.id, cantidadTotal);
            toast.success(`${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} agregada${quantity > 1 ? 's' : ''} al carrito`, {
                style: { background: "#0A3981", color: "#fff" },
                icon: "🛒",
            });
        } else {
            // Si no existe, validar que la cantidad no exceda el stock
            if (quantity > stockDisponible) {
                toast.error(`Solo hay ${stockDisponible} unidad${stockDisponible > 1 ? 'es' : ''} disponible${stockDisponible > 1 ? 's' : ''}`, {
                    style: { background: "#dc2626", color: "#fff" },
                });
                return;
            }
            
            // Si la validación pasa, agregar nuevo item
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
            });
            toast.success(`${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} de ${product.name} agregada${quantity > 1 ? 's' : ''} al carrito`, {
                style: { background: "#0A3981", color: "#fff" },
                icon: "🛒",
            });
        }
        
        setQuantity(1); // Resetear cantidad después de agregar
    };

    // Manejar compra directa
    const handleBuyNow = async () => {
        if (!product.inStock) {
            toast.error("Este producto no está disponible", {
                style: { background: "#dc2626", color: "#fff" },
            });
            return;
        }

        // Verificar autenticación solo cuando se hace click (sin petición al servidor)
        const isAuthenticated = checkAuthentication();
        if (!isAuthenticated) {
            toast.error('Inicia sesión para continuar con la compra', {
                style: { background: "#dc2626", color: "#fff" },
            });
            router.push('/cuenta/login');
            return;
        }

        // Sincronizar carrito backend (ignorar si ya existe)
        try {
            const refaccionId = Number(product.id) || refaccion.id;
            if (!refaccionId) {
                throw new Error("ID de producto inválido");
            }
            await addCartItemAction(refaccionId, quantity);
        } catch (error) {
            console.error("Error al sincronizar carrito:", error);
            toast.error('No se pudo agregar al carrito', {
                style: { background: "#dc2626", color: "#fff" },
            });
            return;
        }

        // Validar stock disponible
        const stockDisponible = refaccion.existencias;
        const existingItem = items.find(item => item.id === product.id);
        
        if (existingItem) {
            // Si ya existe en el carrito, validar cantidad total
            const cantidadTotal = existingItem.quantity + quantity;
            if (cantidadTotal > stockDisponible) {
                const cantidadDisponible = stockDisponible - existingItem.quantity;
                if (cantidadDisponible <= 0) {
                    toast.error(`Ya tienes ${existingItem.quantity} unidad${existingItem.quantity > 1 ? 'es' : ''} en el carrito. Solo hay ${stockDisponible} disponible${stockDisponible > 1 ? 's' : ''}`, {
                        style: { background: "#dc2626", color: "#fff" },
                    });
                } else {
                    toast.error(`Solo puedes agregar ${cantidadDisponible} unidad${cantidadDisponible > 1 ? 'es' : ''} más. Ya tienes ${existingItem.quantity} en el carrito de ${stockDisponible} disponible${stockDisponible > 1 ? 's' : ''}`, {
                        style: { background: "#dc2626", color: "#fff" },
                    });
                }
                return;
            }
            // Actualizar cantidad si es diferente
            if (existingItem.quantity !== cantidadTotal) {
                updateQuantity(product.id, cantidadTotal);
            }
        } else {
            // Si no existe, validar que la cantidad no exceda el stock
            if (quantity > stockDisponible) {
                toast.error(`Solo hay ${stockDisponible} unidad${stockDisponible > 1 ? 'es' : ''} disponible${stockDisponible > 1 ? 's' : ''}`, {
                    style: { background: "#dc2626", color: "#fff" },
                });
                return;
            }
            // Agregar al carrito
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
            });
        }

        // Mostrar checkout
        setShowCheckout(true);
    };

    // Manejar cantidad
    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1) return;
        if (newQuantity > refaccion.existencias) {
            toast.error(`Solo hay ${refaccion.existencias} unidades disponibles`, {
                style: { background: "#dc2626", color: "#fff" },
            });
            return;
        }
        setQuantity(newQuantity);
    };

    // Lógica de Favoritos - Actualiza solo el estado local y sincroniza cuando cambia de pestaña
    const toggleFavorite = () => {
        // Prevenir múltiples clicks simultáneos
        if (isProcessingRef.current || isFavoriteLoading) {
            return;
        }

        // Validar autenticación solo cuando se hace click (sin petición al servidor)
        const currentAuthStatus = checkAuthentication();
        
        // Actualizar estado de autenticación si cambió
        if (currentAuthStatus !== isAuthenticated) {
            setIsAuthenticated(currentAuthStatus);
        }
        
        // Si no está autenticado, mostrar modal
        if (!currentAuthStatus) {
            setShowAuthModal(true);
            return;
        }
        
        // Si está autenticado, asegurarse de que el modal esté cerrado
        if (currentAuthStatus && showAuthModal) {
            setShowAuthModal(false);
        }

        if (!refaccion.id) {
            toast.error('Error: ID de producto no válido', {
                style: { background: "#dc2626", color: "#fff" },
            });
            return;
        }

        // Marcar como procesando brevemente para prevenir clicks rápidos
        isProcessingRef.current = true;
        setIsFavoriteLoading(true);
        
        // Optimistic update - actualizar UI inmediatamente
        const previousFavoriteState = isFavorite;
        const newFavoriteState = !previousFavoriteState;
        setIsFavorite(newFavoriteState);

        // Optimizar cola: si hay acciones opuestas consecutivas, cancelarlas
        const currentActions = getPendingActions();
        const lastAction = currentActions[currentActions.length - 1];
        
        let updatedActions: Array<{ action: 'add' | 'remove'; refaccionId: number }>;
        
        if (lastAction && lastAction.refaccionId === refaccion.id) {
            // Si la última acción es opuesta, cancelarla en lugar de agregar otra
            if ((lastAction.action === 'add' && !newFavoriteState) || 
                (lastAction.action === 'remove' && newFavoriteState)) {
                updatedActions = currentActions.slice(0, -1); // Cancelar acción anterior
            } else {
                // Misma acción, no agregar duplicado
                setIsFavorite(previousFavoriteState); // Revertir cambio
                setIsFavoriteLoading(false);
                isProcessingRef.current = false;
                return;
            }
        } else {
            // Agregar nueva acción a la cola
            if (newFavoriteState) {
                updatedActions = [...currentActions, { action: 'add', refaccionId: refaccion.id }];
            } else {
                updatedActions = [...currentActions, { action: 'remove', refaccionId: refaccion.id }];
            }
        }
        
        // Actualizar ref y sessionStorage
        pendingFavoriteActionsRef.current = updatedActions;
        setPendingActions(updatedActions);

        // Mostrar feedback al usuario
        if (newFavoriteState) {
            toast.success("Agregado a favoritos", {
                icon: "❤️",
                style: { background: "#0A3981", color: "#fff" },
                duration: 2000,
            });
        } else {
            toast.success("Eliminado de favoritos", {
                icon: "💔",
                style: { background: "#0A3981", color: "#fff" },
                duration: 2000,
            });
        }

        // Resetear estado después de un breve delay
        setTimeout(() => {
            setIsFavoriteLoading(false);
            isProcessingRef.current = false;
        }, 300);
    };

    // Manejar publicación de comentario
    const handleSubmitReview = () => {
        // Verificar autenticación solo cuando se hace click (sin petición al servidor)
        const isAuthenticated = checkAuthentication();
        if (!isAuthenticated) {
            toast.error('Inicia sesión para escribir un comentario', {
                style: { background: "#dc2626", color: "#fff" },
            });
            router.push('/cuenta/login');
            return;
        }

        if (!reviewText.trim()) {
            toast.error('Por favor escribe un comentario', {
                style: { background: "#dc2626", color: "#fff" },
            });
            return;
        }

        if (userRating === 0) {
            toast.error('Por favor selecciona una calificación', {
                style: { background: "#dc2626", color: "#fff" },
            });
            return;
        }

        // Aquí iría la lógica para enviar el comentario al backend
        toast.success("¡Gracias por tu opinión!", {
            style: { background: "#0A3981", color: "#fff" },
        });
        setReviewText("");
        setUserRating(0);
    };

    // Renderizado de Estrellas
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
        );
    };

    return (
        <>
        <main className="min-h-screen bg-gray-50 font-sans">
            {/* --- Navegación Superior --- */}
            <section className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="text-[#0A3981] hover:bg-[#D4EBF8]/20 pl-0"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        <span className="hidden sm:inline">
                            Regresar al listado
                        </span>
                    </Button>
                    <nav className="text-xs sm:text-sm text-gray-500 truncate max-w-[200px] sm:max-w-none">
                        <Link
                            href="/categorias"
                            className="hover:text-[#1F509A]"
                        >
                            Categorías
                        </Link>{" "}
                        /
                        <Link
                            href={`/categorias/${categoria}`}
                            className="hover:text-[#1F509A] mx-1 capitalize"
                        >
                            {categoria}
                        </Link>{" "}
                        /
                        <span className="text-[#0A3981] font-medium ml-1 truncate">
                            {product.name}
                        </span>
                    </nav>
                </div>
            </section>

            {/* --- Contenido Principal --- */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8">
                    {/* COLUMNA IZQUIERDA: Imagen y Miniaturas */}
                    <div className="lg:col-span-7 flex flex-col gap-4">
                        <div className="relative aspect-square w-full bg-white rounded-xl overflow-hidden border border-gray-100 group">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                priority
                            />
                            {/* Badge Flotante */}
                            {!product.inStock && (
                                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                                    Agotado
                                </div>
                            )}
                        </div>
                        {/* Aquí irían miniaturas si tuvieras más imágenes */}
                    </div>

                    {/* COLUMNA DERECHA: Buy Box y Detalles */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {/* Header del Producto */}
                        <div>
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-semibold text-[#1F509A] tracking-wider uppercase mb-1">
                                    {product.brand}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={toggleFavorite}
                                        disabled={isFavoriteLoading}
                                        className="p-2 rounded-full hover:bg-gray-100 transition text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label={isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
                                        aria-busy={isFavoriteLoading}
                                    >
                                        <Heart
                                            className={`h-6 w-6 transition-colors ${
                                                isFavorite
                                                    ? "fill-red-500 text-red-500"
                                                    : ""
                                            } ${isFavoriteLoading ? "animate-pulse" : ""}`}
                                        />
                                    </button>
                                    <button className="p-2 rounded-full hover:bg-gray-100 transition text-gray-400 hover:text-[#1F509A]">
                                        <Share2 className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold text-[#0A3981] leading-tight mt-1">
                                {product.name}
                            </h1>

                            {/* Rating Summary */}
                            <div className="flex items-center gap-2 mt-3">
                                {renderStars(4)}
                                <span className="text-sm text-gray-500">
                                    (24 opiniones)
                                </span>
                            </div>
                        </div>

                        {/* Precio y Oferta */}
                        <div className="border-t border-b border-gray-100 py-4">
                            <div className="text-4xl font-bold text-gray-900">
                                ${product.price.toLocaleString("es-MX", {
                                    minimumFractionDigits: 2,
                                })}
                                <span className="text-lg text-gray-500 font-normal ml-1">
                                    MXN
                                </span>
                            </div>
                            <p className="text-sm text-green-600 font-medium mt-1 flex items-center gap-1">
                                <CheckCircle size={14} />{" "}
                                Precio disponible online
                            </p>
                        </div>

                        {/* Especificaciones Rápidas */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {product.specs.slice(0, 4).map((s, idx) => (
                                <div
                                    key={idx}
                                    className="bg-[#D4EBF8]/30 p-2 rounded-lg"
                                >
                                    <span className="block text-gray-500 text-xs">
                                        {s.label}
                                    </span>
                                    <span className="block font-medium text-[#0A3981] truncate">
                                        {s.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Selector de Cantidad */}
                        {product.inStock && (
                            <div className="flex items-center gap-4 mt-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Cantidad:
                                </label>
                                <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        disabled={quantity <= 1}
                                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max={refaccion.existencias}
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                        className="w-16 text-center border-0 focus:ring-0 focus:outline-none text-sm font-medium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        disabled={quantity >= refaccion.existencias}
                                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-lg"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                {refaccion.existencias > 0 && (
                                    <span className="text-xs text-gray-500">
                                        {refaccion.existencias} disponible{refaccion.existencias > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Acciones de Compra (CTA) */}
                        <div className="flex flex-col gap-3 mt-4">
                            {product.inStock ? (
                                <>
                                    {showCheckout ? (
                                        <CheckoutButton 
                                            buttonLabel={`Pagar ${quantity} ${quantity === 1 ? 'unidad' : 'unidades'}`}
                                            className="w-full"
                                        />
                                    ) : (
                                        <>
                                            <Button
                                                onClick={handleBuyNow}
                                                className="w-full bg-[#E38E49] hover:bg-[#cf7d3c] text-white text-lg py-6 shadow-lg shadow-orange-100 transition-all hover:shadow-orange-200 transform active:scale-[0.98]"
                                            >
                                                <CreditCard className="mr-2 h-5 w-5" />
                                                Comprar Ahora
                                            </Button>
                                            <Button
                                                onClick={handleAddToCart}
                                                variant="outline"
                                                className="w-full border-2 border-[#E38E49] text-[#E38E49] hover:bg-[#FFF8F3] text-lg py-6 transition-all hover:scale-[1.01] transform active:scale-[0.98]"
                                            >
                                                <ShoppingCart className="mr-2 h-5 w-5" />
                                                Agregar al Carrito
                                                {cartItemQuantity > 0 && (
                                                    <Badge className="ml-2 bg-[#E38E49] text-white">
                                                        {cartItemQuantity}
                                                    </Badge>
                                                )}
                                            </Button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <Button
                                    disabled
                                    className="w-full bg-gray-200 text-gray-400 py-6 cursor-not-allowed"
                                >
                                    No disponible temporalmente
                                </Button>
                            )}

                            <p className="text-xs text-center text-gray-500 mt-2">
                                Vendido y enviado por{" "}
                                <span className="font-bold text-[#0A3981]">
                                    Refaccionaria Vega
                                </span>
                            </p>
                        </div>

                        {/* Garantías (Iconos de confianza) */}
                        <div className="flex flex-col gap-3 mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Truck className="h-5 w-5 text-[#1F509A]" />
                                <span>Envío asegurado a todo el país</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-[#1F509A]" />
                                <span>Garantía de compra protegida</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Zap className="h-5 w-5 text-[#1F509A]" />
                                <span>Despacho en 24 horas hábiles</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Sección Inferior: Descripción y Reviews --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Descripción Detallada (2/3 ancho) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-[#0A3981] mb-4 flex items-center gap-2">
                                <Wrench className="h-5 w-5" />{" "}
                                Descripción del Producto
                            </h2>
                            <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
                                <p>
                                    {product.shortDescription ||
                                        "Este producto cuenta con los más altos estándares de calidad..."}
                                </p>
                                <p className="mt-4">
                                    Ideal para mantenimiento preventivo y
                                    correctivo. Fabricado con materiales
                                    resistentes que aseguran una larga vida
                                    útil. Compatible con los modelos
                                    especificados en la ficha técnica.
                                </p>
                            </div>
                        </div>

                        {/* Ficha Técnica Completa */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h3 className="text-lg font-bold text-[#0A3981] mb-4">
                                Especificaciones Técnicas
                            </h3>
                            <div className="divide-y divide-gray-100">
                                {product.specs.map((s, idx) => (
                                    <div
                                        key={idx}
                                        className="grid grid-cols-3 py-3"
                                    >
                                        <span className="text-gray-500 font-medium">
                                            {s.label}
                                        </span>
                                        <span className="col-span-2 text-gray-900">
                                            {s.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sección de Comentarios / Reviews (1/3 ancho) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-[#0A3981] mb-4">
                                Opiniones
                            </h3>

                            {/* Formulario simple de review */}
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
                                    <>
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
                                            onChange={(e) =>
                                                setReviewText(e.target.value)}
                                        />
                                        <Button
                                            className="w-full mt-2 bg-[#1F509A] text-white text-xs py-2 h-auto"
                                            onClick={handleSubmitReview}
                                            disabled={!reviewText.trim() || userRating === 0}
                                        >
                                            Publicar Opinión
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Lista de Reviews (Ejemplo estático) */}
                            <div className="space-y-4">
                                {[1, 2].map((review) => (
                                    <div
                                        key={review}
                                        className="border-b border-gray-100 pb-4 last:border-0"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold text-gray-900 text-sm">
                                                Usuario Verificado
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                Hace 2 días
                                            </span>
                                        </div>
                                        <div className="mb-2">
                                            {renderStars(5)}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Excelente refacción, llegó a tiempo
                                            y funciona perfecto en mi vehículo.
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        
        {/* Modal de autenticación requerida - Fuera del main para evitar problemas de z-index */}
        {/* Solo mostrar modal si NO está autenticado, está montado Y showAuthModal es true */}
        {/* Verificar autenticación directamente en el render para asegurar que no se muestre si está autenticado */}
        {isMounted && !checkAuthentication() && showAuthModal && (
            <AuthRequiredModal 
                isOpen={showAuthModal} 
                onCloseAction={() => setShowAuthModal(false)} 
            />
        )}
        </>
    );
}
