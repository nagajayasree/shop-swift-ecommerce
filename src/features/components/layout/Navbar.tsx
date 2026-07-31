"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Sun, Moon, LogIn, LogOut, User } from "lucide-react";

interface NavbarProps {
    isLoggedIn: boolean;
    cartCount?: number;
}

export default function Navbar() {
// {
//     // isLoggedIn,
//     // cartCount = 0,
// }: NavbarProps,
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo — left */}
                <Link
                    href="/"
                    className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight"
                >
                    ShopSwift
                </Link>

                {/* Icons — right */}
                <div className="flex items-center gap-5">
                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Cart */}
                    <Link
                        href='/products/cart'
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

                    {/* Login / Logout */}
                    {/* {isLoggedIn ? (
                        <button
                            aria-label="Logout"
                            className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        >
                            <LogOut size={20} />
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            aria-label="Login"
                            className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        >
                            <LogIn size={20} />
                        </Link>
                    )} */}
                </div>
            </div>
        </nav>
    );
}
