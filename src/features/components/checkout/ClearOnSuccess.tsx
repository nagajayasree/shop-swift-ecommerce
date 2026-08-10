"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/features/context/cartContext";

export default function ClearCartOnSuccess() {
    const { clearCart, isHydrated } = useCart();
    const hasCleared = useRef(false);

    useEffect(() => {
        if (!isHydrated || hasCleared.current) return;
        hasCleared.current = true;
        clearCart();
    }, [isHydrated, clearCart]);

    return null;
}
