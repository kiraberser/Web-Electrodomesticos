'use client'

import React, { createContext, useContext, useReducer, useEffect, useMemo, ReactNode, useCallback } from 'react';
import { checkAuthentication } from '@/shared/lib/cookies';
import { getCartAction, removeCartItemAction, clearCartAction, setCartItemQuantityAction } from '@/features/cart/actions';

// Tipos
type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    [key: string]: unknown; // Para otros posibles campos
};

type CartState = {
    items: CartItem[];
};

type CartContextType = {
    items: CartItem[];
    addItem: (product: CartItem) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    clearLocalCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    getItemCount: (productId: string) => number;
};

type CartProviderProps = {
    children: ReactNode;
};

// Reducer
type CartAction = 
    | { type: 'ADD_ITEM'; payload: CartItem }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'LOAD_CART'; payload: CartItem[] }

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                };
            }
            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: 1 }]
            };
        }
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            };
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items
                    .map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: action.payload.quantity }
                            : item
                    )
                    .filter(item => item.quantity > 0)
            };
        case 'CLEAR_CART':
            return {
                ...state,
                items: []
            };
        case 'LOAD_CART':
            return {
                ...state,
                items: action.payload
            };
        default:
            return state;
    }
};

// Contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: CartProviderProps) => {
    const [state, dispatch] = useReducer(cartReducer, {
        items: []
    });

    const syncCart = useCallback(async () => {
        const isAuthenticated = checkAuthentication();
        if (!isAuthenticated) {
            localStorage.removeItem('electromart-cart');
            dispatch({ type: 'LOAD_CART', payload: [] });
            return;
        }
        try {
            const response = await getCartAction();
            const mapped = response.cart.map((item) => ({
                id: String(item.refaccion.id),
                name: item.refaccion.nombre,
                price: Number(item.refaccion.precio),
                image: item.refaccion.imagen || "/placeholder.svg",
                quantity: item.cantidad,
            }));
            dispatch({ type: 'LOAD_CART', payload: mapped });
        } catch (error) {
            console.error('Error cargando carrito desde backend:', error);
        }
    }, []);

    // Load cart on mount and when auth state changes only
    useEffect(() => {
        syncCart();
        const handleAuthEvent = () => syncCart();
        window.addEventListener('cart-auth-changed', handleAuthEvent as EventListener);
        return () => {
            window.removeEventListener('cart-auth-changed', handleAuthEvent as EventListener);
        };
    }, [syncCart]);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('electromart-cart', JSON.stringify(state.items));
    }, [state.items]);

    const addItem = useCallback((product: CartItem) => {
        dispatch({ type: 'ADD_ITEM', payload: product });
    }, []);

    const removeItem = useCallback((productId: string) => {
        if (checkAuthentication()) {
            removeCartItemAction(Number(productId)).catch((error) => {
                console.error('Error eliminando carrito en backend:', error);
            });
        }
        dispatch({ type: 'REMOVE_ITEM', payload: productId });
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (checkAuthentication()) {
            setCartItemQuantityAction(Number(productId), quantity).catch((error) => {
                console.error('Error actualizando cantidad en backend:', error);
            });
        }
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    }, []);

    const clearCart = useCallback(() => {
        if (checkAuthentication()) {
            clearCartAction().catch((error) => {
                console.error('Error limpiando carrito en backend:', error);
            });
        }
        dispatch({ type: 'CLEAR_CART' });
    }, []);

    const clearLocalCart = useCallback(() => {
        dispatch({ type: 'CLEAR_CART' });
    }, []);

    const getTotalItems = useCallback(() => {
        return state.items.reduce((total, item) => total + item.quantity, 0);
    }, [state.items]);

    const getTotalPrice = useCallback(() => {
        return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [state.items]);

    const getItemCount = useCallback((productId: string) => {
        const item = state.items.find(item => item.id === productId);
        return item ? item.quantity : 0;
    }, [state.items]);

    const value: CartContextType = useMemo(() => ({
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        clearLocalCart,
        getTotalItems,
        getTotalPrice,
        getItemCount
    }), [state.items, addItem, removeItem, updateQuantity, clearCart, clearLocalCart, getTotalItems, getTotalPrice, getItemCount]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;