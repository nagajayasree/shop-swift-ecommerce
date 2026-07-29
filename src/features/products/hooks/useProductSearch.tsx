import { useState } from "react";
import { Product } from "../types";

export function useProductSearch(searchValue: string) {
    const [search, setSearch] = useState(searchValue);
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!search.trim()) return;

        setLoading(true);
        setError("");

        try {
            const res = await fetch(
                `https://dummyjson.com/products/search?q=${search}`,
            );
            const data = await res.json();
            setResults(data.products);
        } catch (err) {
            setError("Failed to fetch search results");
        } finally {
            setLoading(false);
        }
    };

    return { search, setSearch, results, loading, error, handleSearch };
}
