import { useState, useCallback } from "react";
import { Product } from "../types";

export function useProductSearch() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<string | null>(null);

    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError("");

        const url = search.trim()
            ? `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}`
            : category
              ? `https://dummyjson.com/products/category/${category}`
              : `https://dummyjson.com/products`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            setResults(data.products);
        } catch (err) {
            setError("Failed to fetch search results");
        } finally {
            setLoading(false);
        }
    }, [search, category]);

    return {
        search,
        setSearch,
        category,
        setCategory,
        results,
        loading,
        error,
        fetchProducts,
    };
}
