"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "../types";
import { useProductSearch } from "../hooks/useProductSearch";

export default function ProductGrid() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { search, setSearch, results, handleSearch } = useProductSearch("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://dummyjson.com/products");
                const data = await response.json();
                setProducts(data.products);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch data");
            }
        };
        fetchData();
    }, []);

    const isSearching = search.trim().length > 0;
    const displayedProducts = isSearching ? results : products;

    return (
        <div className="p-6">
            {!loading && (
                <div className="flex gap-2 mb-6">
                    <input
                        value={search}
                        placeholder="Search for a product"
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="border text-black border-gray-300 rounded-lg px-3 py-2 flex-1"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                        Search
                    </button>
                </div>
            )}

            <div className="flex items-center justify-center">
                {loading && !isSearching && (
                    <p className="text-gray-500">Loading...</p>
                )}
                {error && <p className="text-red-500">{error}</p>}
                {isSearching && displayedProducts.length === 0 && (
                    <p className="text-gray-500">
                        No products found for "{search}"
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 items-start">
                {displayedProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        price={product.price}
                        brand={product.brand}
                        category={product.category}
                        rating={product.rating}
                        thumbnail={product.thumbnail}
                    />
                ))}
            </div>
        </div>
    );
}
