'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

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
    getTotalItems: () => number;
    getTotalPrice: () => number;
    getItemCount: (productId: string) => number;
};

type CartProviderProps = {
    children: ReactNode;
};

// Reducer
const cartReducer = (state: CartState, action: any): CartState => {
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

    // Load cart from localStorage on component mount
    useEffect(() => {
        const savedCart = localStorage.getItem('electromart-cart');
        if (savedCart) {
            dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('electromart-cart', JSON.stringify(state.items));
    }, [state.items]);

    const addItem = (product: CartItem) => {
        dispatch({ type: 'ADD_ITEM', payload: product });
    };

    const removeItem = (productId: string) => {
        dispatch({ type: 'REMOVE_ITEM', payload: productId });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const getTotalItems = () => {
        return state.items.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getItemCount = (productId: string) => {
        const item = state.items.find(item => item.id === productId);
        return item ? item.quantity : 0;
    };

    const value: CartContextType = {
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getItemCount
    };

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