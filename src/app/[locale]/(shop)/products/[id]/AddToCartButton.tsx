"use client";

import { useCart } from "@/features/context/cartContext";
import { CartProduct } from "@/features/products/types";

export default function AddToCartButton({
    product,
    label,
}: {
    product: CartProduct;
    label: string;
}) {
    const { cartItems, addToCart, updateItemQuantity } = useCart();

    const cartItem = cartItems.find((item) => item.id === product.id);
    const quantity = cartItem?.quantity ?? 0;

    if (quantity === 0) {
        return (
            <button
                onClick={() => addToCart(product)}
                className="mt-4 px-6 py-3 border bg-gray-700 text-sm text-white hover:text-white dark:text-white dark:border-gray-600 dark:hover:bg-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
                {label}
            </button>
        );
    }

    return (
        <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-600 px-2 py-1">
                <button
                    onClick={() =>
                        updateItemQuantity(
                            product.id,
                            Math.max(0, quantity - 1),
                        )
                    }
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                >
                    −
                </button>
                <span className="w-6 text-center text-sm font-medium text-neutral-900 dark:text-white">
                    {quantity}
                </span>
                <button
                    onClick={() => updateItemQuantity(product.id, quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    aria-label="Increase quantity"
                >
                    +
                </button>
            </div>
            {/* <span className="px-4 py-2.5 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold text-sm">
                {quantity} in cart
            </span> */}
        </div>
    );
}
