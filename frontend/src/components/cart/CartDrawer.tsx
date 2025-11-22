import React from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '../ui/forms/Button';
import { useCart } from '@/context/CartContext';

const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();

    if (!isOpen) return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-gray-500 opacity-75 bg-opacity-50 z-40"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Carrito de Compras
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex flex-col h-full">
                    {items.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Tu carrito está vacío
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Agrega productos para comenzar a comprar
                                </p>
                                <Button onClick={onClose}>
                                    Seguir comprando
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 line-clamp-1">
                                                    {item.name}
                                                </h4>
                                                <p className="text-sm text-gray-600">{item.category}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </Button>
                                                        <span className="w-8 text-center font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </p>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-red-600 hover:text-red-800 h-6 p-0"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t p-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-semibold text-gray-900">
                                            Total:
                                        </span>
                                        <span className="text-2xl font-bold text-gray-900">
                                            {formatPrice(getTotalPrice())}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={clearCart}
                                            className="w-full"
                                        >
                                            Vaciar carrito
                                        </Button>
                                        <Button
                                            className="w-full bg-orange-500 hover:bg-orange-600"
                                            onClick={() => {
                                                // TODO: Implement checkout logic
                                                alert('Funcionalidad de checkout próximamente');
                                            }}
                                        >
                                            Proceder al pago
                                        </Button>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        className="w-full"
                                        onClick={onClose}
                                    >
                                        Continuar comprando
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartDrawer;