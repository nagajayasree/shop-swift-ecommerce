"use client";

import { useState } from "react";
import { useCart } from "@/features/context/cartContext";
import { useAuth } from "@/features/context/authContext";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function Cart() {
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);

    const t = useTranslations();

    const router = useRouter();
    const { isLoggedIn, loading } = useAuth();

    const { cartItems, removeFromCart, updateItemQuantity, clearCart } =
        useCart();

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * (item?.quantity || 0),
        0,
    );

    async function handleCheckout() {
        if (!isLoggedIn) {
            router.push("/login?redirect=/cart");
            return;
        }

        setIsCheckingOut(true);
        setCheckoutError(null);

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cartItems.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                    })),
                }),
            });

            if (!res.ok) {
                throw new Error("Checkout failed");
            }

            const { url } = await res.json();

            if (!url) {
                throw new Error("No checkout URL returned");
            }

            window.location.href = url;
        } catch (err) {
            setCheckoutError(
                "Something went wrong starting checkout. Please try again.",
            );
            setIsCheckingOut(false);
        }
    }

    return (
        <div className="min-h-screen p-6 dark:bg-neutral-900 bg-neutral-50">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-md font-semibold text-neutral-900 dark:text-white mb-6">
                        {t("CartPage.title")}
                    </p>
                    {cartItems.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-sm text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 transition-colors"
                        >
                            {t("CartPage.clearCart")}
                        </button>
                    )}
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-neutral-500 dark:text-neutral-400 text-lg">
                            {t("CartPage.emptyMessage")}
                        </p>
                    </div>
                ) : (
                    <>
                        <ul className="space-y-3">
                            {cartItems.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-neutral-800 shadow-sm border border-neutral-100 dark:border-neutral-700"
                                >
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="w-20 h-20 object-cover rounded-lg shrink-0"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-semibold text-neutral-900 dark:text-white truncate">
                                            {item.title}
                                        </h4>
                                        <p className="text-base font-bold text-blue-600 dark:text-blue-400 mt-1">
                                            ${item.price.toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-600 px-1">
                                        <button
                                            onClick={() =>
                                                updateItemQuantity(
                                                    item.id,
                                                    Math.max(
                                                        1,
                                                        item?.quantity
                                                            ? item.quantity - 1
                                                            : 0,
                                                    ),
                                                )
                                            }
                                            className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                                            aria-label="Decrease quantity"
                                        >
                                            −
                                        </button>
                                        <span className="w-6 text-center text-sm font-medium text-neutral-900 dark:text-white">
                                            {item?.quantity || 0}
                                        </span>
                                        <button
                                            onClick={() =>
                                                updateItemQuantity(
                                                    item.id,
                                                    item?.quantity
                                                        ? item.quantity + 1
                                                        : 1,
                                                )
                                            }
                                            className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                                            aria-label="Increase quantity"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="ml-2 text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors shrink-0"
                                    >
                                        {t("CartPage.remove")}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                            <span className="text-neutral-600 dark:text-neutral-300 text-base">
                                {t("CartPage.subtotal")}
                            </span>
                            <span className="text-xl font-bold text-neutral-900 dark:text-white">
                                ${subtotal.toFixed(2)}
                            </span>
                        </div>

                        {checkoutError && (
                            <p className="mt-2 text-sm text-red-500">
                                {checkoutError}
                            </p>
                        )}

                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="mt-4 w-full py-3 rounded-lg bg-gray-700 hover:bg-gray-900 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCheckingOut
                                ? t("CartPage.processing")
                                : !isLoggedIn
                                  ? t("CartPage.loginToCheckout")
                                  : t("CartPage.checkout")}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
