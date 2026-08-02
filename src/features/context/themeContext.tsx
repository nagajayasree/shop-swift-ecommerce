"use client";

import {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect,
} from "react";

type Theme = "light" | "dark" | "blue";

interface ThemeContextValue {
    themeValue: Theme;
    toggleSwitch: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
    undefined,
);

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const [themeValue, setThemeValue] = useState<Theme>(() => {
        if (typeof window === "undefined") return "light";
        return (localStorage.getItem("theme") as Theme) || "light";
    });
    
    useEffect(() => {
        document.documentElement.classList.toggle(
            "dark",
            themeValue === "dark",
        );
        localStorage.setItem("theme", themeValue);
    }, [themeValue]);

    const toggleSwitch = () => {
        setThemeValue((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext value={{ themeValue, toggleSwitch }}>
            {children}
        </ThemeContext>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
}
