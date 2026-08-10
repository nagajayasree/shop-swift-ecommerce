"use client";

import { useState, createContext, useContext, useEffect } from "react";

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
    isHydrated: boolean;
    addToCart: (id: CartItem) => void;
    removeFromCart: (itemId: number) => void;
    updateItemQuantity: (itemId: number, quantity: number) => void;
    getCartCount: () => number;
    clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_STORAGE_KEY = "shopswift-cart";

export default function CartProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    // Hydrate from localStorage once, on mount (client only)
    useEffect(() => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            if (stored) {
                setCartItems(JSON.parse(stored));
            }
        } catch (err) {
            console.error("Failed to read cart from localStorage:", err);
        } finally {
            setIsHydrated(true);
        }
    }, []);

    // Persist whenever cartItems changes — but skip the very first render
    // before hydration finishes, or we'd overwrite saved data with []
    useEffect(() => {
        if (!isHydrated) return;
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } catch (err) {
            console.error("Failed to save cart to localStorage:", err);
        }
    }, [cartItems, isHydrated]);

    // Optional: keep cart in sync across tabs
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === CART_STORAGE_KEY && e.newValue) {
                try {
                    setCartItems(JSON.parse(e.newValue));
                } catch (err) {
                    console.error(
                        "Failed to parse cart from storage event:",
                        err,
                    );
                }
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

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
        setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== itemId),
        );
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

    return (
        <CartContext
            value={{
                cartCount,
                cartItems,
                isHydrated,
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
