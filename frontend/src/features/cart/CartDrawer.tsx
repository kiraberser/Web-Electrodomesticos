import React from "react";
import Image from "next/image";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { Button } from "@/shared/ui/forms/Button";
import { useCart } from "@/features/cart/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CartDrawer = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const router = useRouter();
    const { items, updateQuantity, removeItem, getTotalPrice, clearCart } =
        useCart();
    const subtotal = getTotalPrice();
    const shippingFee = subtotal > 0 ? 800 : 0;
    const totalWithShipping = subtotal + shippingFee;

    if (!isOpen) return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(price);
    };

    const handleCheckout = () => {
        onClose();
        router.push("/checkout");
    }

    return (
        <>
            {/* Overlay */}
            <div className="relative z-50">
                {/* Overlay con blur y fade-in */}
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                {/* Drawer Container */}
                {/* Usamos w-full para móviles y max-w-md para pantallas grandes */}
                <div className="fixed inset-y-0 right-0 flex h-[100dvh] w-full sm:max-w-[400px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out border-l border-gray-200">
                    {/* 1. HEADER (Fijo arriba) */}
                    <div className="flex-none px-5 py-4 border-b border-gray-100 bg-white">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-bold text-gray-900">
                                Tu Carrito ({items.length})
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="rounded-full hover:bg-gray-100"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Barra de envío gratis */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            {subtotal >= 800
                                ? (
                                    <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                                        <span>🎉</span> ¡Tu pedido tiene{" "}
                                        <strong>envío GRATIS</strong>!
                                    </div>
                                )
                                : (
                                    <div className="text-sm text-gray-600">
                                        Agrega{" "}
                                        <span className="font-bold text-gray-900">
                                            {formatPrice(800 - subtotal)}
                                        </span>{" "}
                                        para envío gratis.
                                        {/* Barra de progreso visual */}
                                        <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${
                                                        (subtotal / 800) * 100
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* 2. CONTENIDO SCROLLABLE (Lista de productos) */}
                    <div className="flex-1 overflow-y-auto min-h-0 bg-gray-50/50">
                        {items.length === 0
                            ? (
                                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Tu carrito está vacío
                                    </h3>
                                    <p className="text-gray-500 mt-1 mb-6 text-sm">
                                        Parece que aún no has agregado nada.
                                    </p>
                                    <Link
                                        href="/categorias"
                                        onClick={onClose}
                                        className="w-full bg-black px-4 py-2 rounded-lg text-white hover:bg-gray-800"
                                    >
                                        Explorar productos
                                    </Link>
                                </div>
                            )
                            : (
                                <div className="p-4 space-y-4">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            {/* Imagen Producto */}
                                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                                                <Image
                                                    src={String(
                                                        item.image ||
                                                            "/placeholder.svg",
                                                    )}
                                                    alt={String(
                                                        item.name || "Producto",
                                                    )}
                                                    fill
                                                    className="object-contain p-2"
                                                />
                                            </div>

                                            {/* Detalles Producto */}
                                            <div className="flex flex-1 flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 pr-2 leading-tight">
                                                            {item.name ||
                                                                "Nombre del producto"}
                                                        </h4>
                                                        <button
                                                            onClick={() =>
                                                                removeItem(
                                                                    item.id,
                                                                )}
                                                            className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-1"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-900 mt-1">
                                                        {formatPrice(
                                                            item.price,
                                                        )}
                                                    </p>
                                                </div>

                                                {/* Controles de Cantidad */}
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 h-8">
                                                        <button
                                                            onClick={() =>
                                                                item.quantity >
                                                                        1
                                                                    ? updateQuantity(
                                                                        item.id,
                                                                        item.quantity -
                                                                            1,
                                                                    )
                                                                    : removeItem(
                                                                        item.id,
                                                                    )}
                                                            className="px-2.5 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg active:scale-95 transition-transform"
                                                        >
                                                            <Minus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-semibold text-gray-900">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity +
                                                                        1,
                                                                )}
                                                            className="px-2.5 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg active:scale-95 transition-transform"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs font-medium text-gray-500">
                                                        Total:{" "}
                                                        {formatPrice(
                                                            item.price *
                                                                item.quantity,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </div>

                    {/* 3. FOOTER (Fijo abajo con sombra superior) */}
                    {items.length > 0 && (
                        <div className="flex-none bg-white p-5 border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 pb-safe">
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>Envío</span>
                                    <span
                                        className={shippingFee === 0
                                            ? "text-green-600 font-medium"
                                            : ""}
                                    >
                                        {shippingFee === 0
                                            ? "GRATIS"
                                            : formatPrice(shippingFee)}
                                    </span>
                                </div>
                                <div className="pt-2 mt-2 border-t border-dashed border-gray-200 flex items-center justify-between">
                                    <span className="text-base font-bold text-gray-900">
                                        Total
                                    </span>
                                    <span className="text-xl font-bold text-gray-900">
                                        {formatPrice(totalWithShipping)}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button onClick={handleCheckout} className="w-full h-12 text-base font-semibold bg-[#B12704] hover:bg-[#9b2203] text-white shadow-sm flex items-center justify-center gap-2">
                                    Proceder al pago
                                    <ArrowRight className="w-4 h-4" />
                                </Button>

                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        onClick={onClose}
                                        className="text-xs text-gray-500 hover:text-gray-900 underline"
                                    >
                                        Seguir comprando
                                    </button>
                                    <span className="text-gray-300">|</span>
                                    <button
                                        onClick={clearCart}
                                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                                    >
                                        <Trash2 className="w-3 h-3" />{" "}
                                        Vaciar carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
