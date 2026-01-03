"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { type Refaccion } from "@/api/productos";
import { type Brand, type Product, ProductType } from "@/data/products";
import CheckoutButton from "@/components/checkout/CheckoutButton";
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
import { Badge } from "@/components/ui"; // Tu componente existente

interface Props {
    categoria: string;
    refaccion: Refaccion;
}

// Helper function to check if user is authenticated
// Usamos la cookie 'username' que no es httpOnly para verificar autenticación
function checkAuthentication(): boolean {
    if (typeof document === 'undefined') return false;
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        // Verificar si existe la cookie 'username' (no httpOnly)
        if (name === 'username' && value) {
            return true;
        }
    }
    return false;
}

export default function ProductDetailClient({ categoria, refaccion }: Props) {
    const router = useRouter();
    const { addItem, items, updateQuantity } = useCart();

    // Estados para interactividad local
    const [isFavorite, setIsFavorite] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);

    // Verificar autenticación al montar el componente y cuando cambie
    useEffect(() => {
        const checkAuth = () => {
            try {
                const authenticated = checkAuthentication();
                setIsAuthenticated(authenticated);
            } catch (error) {
                console.error('Error checking auth:', error);
                setIsAuthenticated(false);
            }
        };
        
        // Verificar después de que el componente se monte
        if (typeof window !== 'undefined') {
            // Verificar inmediatamente
            checkAuth();
            
            // Verificar periódicamente (cada 2 segundos) para detectar cambios en cookies
            const interval = setInterval(checkAuth, 2000);
            
            // Verificar cuando la página vuelve a tener foco (por si el usuario inició sesión en otra pestaña)
            const handleFocus = () => {
                checkAuth();
            };
            
            window.addEventListener('focus', handleFocus);
            
            return () => {
                clearInterval(interval);
                window.removeEventListener('focus', handleFocus);
            };
        }
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
    const handleAddToCart = () => {
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
    const handleBuyNow = () => {
        if (!product.inStock) {
            toast.error("Este producto no está disponible", {
                style: { background: "#dc2626", color: "#fff" },
            });
            return;
        }

        // Verificar autenticación
        if (!isAuthenticated) {
            toast.error('Inicia sesión para continuar con la compra', {
                style: { background: "#dc2626", color: "#fff" },
            });
            router.push('/cuenta');
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

    // Lógica de Favoritos
    const toggleFavorite = () => {
        if (!isAuthenticated) {
            toast.error('Inicia sesión para agregar a favoritos', {
                style: { background: "#dc2626", color: "#fff" },
            });
            router.push('/cuenta');
            return;
        }
        setIsFavorite(!isFavorite);
        toast(isFavorite ? "Eliminado de favoritos" : "Agregado a favoritos", {
            icon: isFavorite ? "💔" : "❤️",
        });
    };

    // Manejar publicación de comentario
    const handleSubmitReview = () => {
        if (!isAuthenticated) {
            toast.error('Inicia sesión para escribir un comentario', {
                style: { background: "#dc2626", color: "#fff" },
            });
            router.push('/cuenta');
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
                                        className="p-2 rounded-full hover:bg-gray-100 transition text-gray-400 hover:text-red-500"
                                    >
                                        <Heart
                                            className={`h-6 w-6 ${
                                                isFavorite
                                                    ? "fill-red-500 text-red-500"
                                                    : ""
                                            }`}
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
                                {!isAuthenticated ? (
                                    <div className="text-center py-4">
                                        <p className="text-sm font-medium text-gray-700 mb-3">
                                            Inicia sesión para escribir una opinión
                                        </p>
                                        <Button
                                            className="w-full bg-[#1F509A] text-white text-xs py-2 h-auto"
                                            onClick={() => router.push('/cuenta')}
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
    );
}
