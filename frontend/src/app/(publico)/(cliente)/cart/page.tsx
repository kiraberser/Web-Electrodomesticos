"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2, CreditCard } from "lucide-react";
import { Button } from "@/shared/ui/forms/Button";
import { useCart } from "@/features/cart/CartContext";
import CheckoutButton from "@/features/checkout/CheckoutButton";
import { getDireccionesAction } from "@/features/auth/actions";
import { checkAuthentication } from "@/shared/lib/cookies";

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
    }).format(price);
};

export default function CartPage() {
    const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart();
    const [hasDirecciones, setHasDirecciones] = useState(false);
    const [checkingDirecciones, setCheckingDirecciones] = useState(true);
    
    const subtotal = getTotalPrice();
    const shippingFee = 0;
    const totalWithShipping = subtotal + shippingFee;

    useEffect(() => {
        const checkDirecciones = async () => {
            const isAuthenticated = checkAuthentication();
            if (!isAuthenticated) {
                setCheckingDirecciones(false);
                return;
            }

            try {
                const response = await getDireccionesAction();
                if (response.success && response.data && response.data.length > 0) {
                    setHasDirecciones(true);
                }
            } catch (error) {
                console.error("Error verificando direcciones:", error);
            } finally {
                setCheckingDirecciones(false);
            }
        };

        checkDirecciones();
    }, []);

    return (
        <main className="min-h-screen bg-gray-50">
            <section className="container mx-auto px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0A3981]">Tu carrito</h1>
                        <p className="text-sm text-gray-500">
                            Revisa tus productos antes de finalizar la compra
                        </p>
                    </div>
                    <Link
                        href="/categorias"
                        className="text-sm font-medium text-[#1F509A] hover:text-[#0A3981] transition-colors"
                    >
                        Seguir comprando
                    </Link>
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
                        <ShoppingCart className="h-12 w-12 text-gray-400" />
                        <h2 className="mt-4 text-lg font-semibold text-gray-800">
                            Tu carrito está vacío
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Agrega productos para comenzar a comprar
                        </p>
                        <Link href="/categorias">
                            <Button className="mt-6 bg-[#1F509A] hover:bg-[#0A3981] text-white">
                                Ver productos
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
                        {/* Lista de productos */}
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center"
                                >
                                    <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-gray-200 bg-gray-50">
                                        <Image
                                            src={String(item.image || "/placeholder.svg")}
                                            alt={String(item.name)}
                                            fill
                                            className="object-cover"
                                            sizes="96px"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                                            {String(item.name)}
                                        </h3>
                                        {"category" in item && (
                                            <p className="text-xs text-gray-500">
                                                {String(item.category)}
                                            </p>
                                        )}
                                        <p className="mt-1 text-sm font-medium text-[#0A3981]">
                                            {formatPrice(Number(item.price))}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-2 py-1">
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
                                                aria-label="Disminuir cantidad"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-6 text-center text-sm font-semibold text-gray-900">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
                                                aria-label="Aumentar cantidad"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {formatPrice(Number(item.price) * item.quantity)}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="mt-1 inline-flex items-center text-xs font-medium text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="mr-1 h-3 w-3" />
                                                Quitar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900">Resumen</h2>

                            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">
                                    {formatPrice(subtotal)}
                                </span>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                                <span>Envío</span>
                                <span className="font-medium text-gray-900">
                                    {formatPrice(shippingFee)}
                                </span>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t pt-4">
                                <span className="text-base font-semibold text-gray-900">Total</span>
                                <span className="text-xl font-bold text-[#0A3981]">
                                    {formatPrice(totalWithShipping)}
                                </span>
                            </div>

                            <div className="mt-6 space-y-3">
                                {checkingDirecciones ? (
                                    <Button
                                        disabled
                                        className="w-full bg-gray-400 text-white"
                                    >
                                        Verificando...
                                    </Button>
                                ) : hasDirecciones ? (
                                    <CheckoutButton />
                                ) : (
                                    <Link href="/checkout" className="block">
                                        <Button className="w-full bg-[#E38E49] hover:bg-[#d68340] text-white">
                                            <CreditCard className="mr-2 h-5 w-5" />
                                            Proceder al pago
                                        </Button>
                                    </Link>
                                )}
                                <Button
                                    variant="ghost"
                                    onClick={clearCart}
                                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Vaciar carrito
                                </Button>
                            </div>

                            <p className="mt-4 text-xs text-gray-500">
                                Los precios incluyen impuestos. Envío mínimo: {formatPrice(800)}.
                            </p>
                        </aside>
                    </div>
                )}
            </section>
        </main>
    );
}