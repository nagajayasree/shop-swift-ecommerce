// hooks/useProductFilter.ts
import { useMemo, useState } from "react";
import { Product } from "../types";

interface Filters {
    category: string | null;
    brand: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    minRating: number | null;
}

const defaultFilters: Filters = {
    category: null,
    brand: null,
    minPrice: null,
    maxPrice: null,
    minRating: null,
};

export function useProductFilter(products: Product[]) {
    const [filters, setFilters] = useState<Filters>(defaultFilters);

    const updateFilter = <K extends keyof Filters>(
        key: K,
        value: Filters[K],
    ) => {
        console.log("updateFilter called:", key, value);
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => setFilters(defaultFilters);

    const filteredProducts = useMemo(() => {
        return products
           .filter((p) => {
            if (filters.category && p.category !== filters.category)
                return false;
            if (filters.brand && p.brand !== filters.brand) return false;
            if (filters.minPrice != null && p.price < filters.minPrice)
                return false;
            if (filters.maxPrice != null && p.price > filters.maxPrice)
                return false;
            if (
                filters.minRating != null &&
                (p.rating < filters.minRating || p.rating >= filters.minRating + 1)
            )
                return false;
            return true;
        })
            .sort((a, b) => b.rating - a.rating);
    }, [products, filters]);

    return { filters, updateFilter, resetFilters, filteredProducts };
}
