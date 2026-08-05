// src/components/LanguageSwitcher.tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const nextLocale = locale === "en" ? "fr" : "en";

    const handleToggle = () => {
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <button
            onClick={handleToggle}
            aria-label={`Switch to ${nextLocale === "en" ? "English" : "French"}`}
            className="
        px-2 py-1 text-sm font-medium rounded-md
        bg-transparent
        text-gray-700 dark:text-gray-200
        hover:bg-gray-100 dark:hover:bg-gray-800
        transition-colors
        cursor-pointer
      "
        >
            {locale === "en" ? "FR" : "ENG"}
        </button>
    );
}
