"use client";

import Link from "next/link";
import { ShoppingCart, Sun, Moon, LogIn, LogOut } from "lucide-react";
import { useTheme } from "@/features/context/themeContext";
import { useAuth } from "@/features/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavbarProps {
    // isUserLoggedIn: boolean;
    // cartCount?: number;
}

export default function Navbar() {
    // {
    // isUserLoggedIn,
    // cartCount = 0,
    // }: NavbarProps
    const { themeValue, toggleSwitch } = useTheme();
    const { isLoggedIn, signOut } = useAuth();

    const router = useRouter();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    console.log(themeValue);

    console.log("isLoggedIn:", isLoggedIn);

    const handleLogout = async () => {
        try {
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

                    <Link
                        href="/products/cart"
                        aria-label="Cart"
                        className="relative text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                        <ShoppingCart size={20} />

                        {/* {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )} */}
                    </Link>

                    <LanguageSwitcher />

                    {/* Login / Logout */}
                    {isLoggedIn ? (
                        <button
                            aria-label="Logout"
                            className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                            onClick={handleLogout}
                        >
                            <LogOut size={20} />
                        </button>
                    ) : (
                        <button
                            className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                            onClick={() => router.push("/login")}
                        >
                            <LogIn size={20} />
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
