"use client";

import { useState, createContext, useContext } from "react";

type CartItem = {
    id: number;
    title: string;
    price: number;
    quantity?: number;
    thumbnail: string;
};

interface CartContextValue {
    cartCount: number;
    cartItems: CartItem[];
    addToCart: (id: CartItem) => void;
    removeFromCart: (itemId: number) => void;
    updateItemQuantity: (itemId: number, quantity: number) => void;
    getCartCount: () => number;
    clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export default function CartProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (item: CartItem) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((i) => i.id === item.id);
            if (existingItem) {
                return prevItems.map((i) =>
                    i.id === item.id
                        ? { ...i, quantity: (i.quantity ?? 0) + 1 }
                        : i,
                );
            } else {
                return [...prevItems, { ...item, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (itemId: number) => {
        setCartItems(cartItems.filter((item) => item.id !== itemId));
    };

    const updateItemQuantity = (itemId: number, quantity: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId ? { ...item, quantity } : item,
            ),
        );
    };

    const getCartCount = () => {
        return cartItems.reduce(
            (count, item) => count + (item.quantity ?? 0),
            0,
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    // console.log("Cart Items:", cartItems, "Cart Count:", getCartCount());

    return (
        <CartContext
            value={{
                cartCount,
                cartItems,
                addToCart,
                removeFromCart,
                updateItemQuantity,
                getCartCount,
                clearCart,
            }}
        >
            {children}
        </CartContext>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within a CartProvider");
    return ctx;
}
