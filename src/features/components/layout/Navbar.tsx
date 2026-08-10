"use client";

import Link from "next/link";
import {
    ShoppingCart,
    Sun,
    Moon,
    LogOut,
    CircleUserRound,
    ChevronDown,
} from "lucide-react";
import { useTheme } from "@/features/context/themeContext";
import { useAuth } from "@/features/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useCart } from "@/features/context/cartContext";
import { useTranslations } from "next-intl";

export default function Navbar() {
    const { themeValue, toggleSwitch } = useTheme();
    const { isLoggedIn, signOut, user } = useAuth();
    const { getCartCount } = useCart();

    const router = useRouter();

    const t = useTranslations();

    const [mounted, setMounted] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close dropdown on Escape
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setIsDropdownOpen(false);
        }
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    const handleLogout = async () => {
        try {
            setIsDropdownOpen(false);
            await signOut();
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/100 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight"
                >
                    ShopSwift
                </Link>

                <div className="flex items-center gap-5">
                    {/* Login / Account dropdown */}
                    {isLoggedIn ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                aria-label="Account menu"
                                aria-expanded={isDropdownOpen}
                                aria-haspopup="true"
                                className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap"
                                onClick={() =>
                                    setIsDropdownOpen((prev) => !prev)
                                }
                            >
                                <CircleUserRound size={18} />
                                <span className="text-sm">
                                    {t("Navbar.hi")}, {user?.displayName}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {isDropdownOpen && (
                                <div
                                    role="menu"
                                    className="absolute top-full right-0 mt-2 w-56 origin-top-right rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg py-1 z-50"
                                >
                                    <Link
                                        href="/account"
                                        role="menuitem"
                                        className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        {t("Navbar.myAccount")}
                                    </Link>
                                    <Link
                                        href="/orders"
                                        role="menuitem"
                                        className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        {t("Navbar.myOrders")}
                                    </Link>
                                    <hr className="my-1 border-neutral-200 dark:border-neutral-800" />
                                    <button
                                        role="menuitem"
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={16} />
                                        {t("Navbar.logout")}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                            onClick={() => router.push("/login")}
                        >
                            <CircleUserRound size={20} />
                        </button>
                    )}

                    {/* Theme toggle */}
                    <button
                        onClick={toggleSwitch}
                        aria-label="Toggle theme"
                        className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                        {themeValue === "dark" ? (
                            <Sun size={20} />
                        ) : (
                            <Moon size={20} />
                        )}
                    </button>

                    <LanguageSwitcher />

                    <Link
                        href="/products/cart"
                        aria-label="Cart"
                        className="relative text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                        <ShoppingCart size={20} />

                        {getCartCount() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                                {getCartCount()}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
