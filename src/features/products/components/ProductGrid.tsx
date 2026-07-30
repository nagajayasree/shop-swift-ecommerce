"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "../types";
import { useProductSearch } from "../hooks/useProductSearch";
import { useProductFilter } from "../hooks/useProductFilter";

interface ProductGridProps {
    initialProducts: Product[];
}

export default function ProductGrid({ initialProducts }: ProductGridProps) {
    const [products] = useState<Product[]>(initialProducts);

    const {
        search,
        setSearch,
        results,
        loading: searching,
        error: searchError,
        fetchProducts,
    } = useProductSearch();

    const isSearching = search.trim().length > 0;
    const baseProducts = isSearching ? results : products;

    const { filters, updateFilter, resetFilters, filteredProducts } =
        useProductFilter(baseProducts);

    const categories = [
        ...new Set(products.map((product) => product.category).filter(Boolean)),
    ];

    const brands = [
        ...new Set(products.map((product) => product.brand).filter(Boolean)),
    ];

    const ratingOptions = [1, 2, 3, 4, 5];

    const priceOptions = [10, 25, 50, 75, 100, 150, 200, 300, 500];

    return (
        <div className="p-6">
            <div className="flex gap-2 mb-6">
                <input
                    value={search}
                    placeholder="Search for a product"
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
                    className="border text-black border-gray-300 rounded-lg px-3 py-2 flex-1"
                />
                <button
                    onClick={fetchProducts}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                    Search
                </button>
            </div>

            <div className="flex gap-2 mb-6">
                <span className="flex flex-col text-xs">
                    <label className="text-black">Category:</label>
                    <select
                        value={filters.category ?? ""}
                        onChange={(e) =>
                            updateFilter("category", e.target.value || null)
                        }
                        className="border text-black border-gray-300 rounded-lg px-3 py-2 flex-1"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                </span>

                <span className="flex flex-col text-xs">
                    <label className="text-black">Brand:</label>
                    <select
                        value={filters.brand ?? ""}
                        onChange={(e) =>
                            updateFilter("brand", e.target.value || null)
                        }
                        className="border text-black border-gray-300 rounded-lg px-3 py-2 flex-1"
                    >
                        <option value="">All Brands</option>
                        {brands.map((brand, index) => (
                            <option key={index} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </select>
                </span>

                <span className="flex flex-col text-xs">
                    <label className="text-black">Rating:</label>
                    <select
                        value={filters.minRating ?? ""}
                        onChange={(e) =>
                            updateFilter(
                                "minRating",
                                e.target.value ? Number(e.target.value) : null,
                            )
                        }
                        className="border text-black border-gray-300 rounded-lg px-3 py-2 flex-1"
                    >
                        <option value="">Any Rating</option>
                        {ratingOptions.map((r) => (
                            <option key={r} value={r}>
                                {r} {r === 1 ? "Star" : "Stars"}
                            </option>
                        ))}
                    </select>
                </span>

                <span className="flex flex-col text-xs">
                    <label className="text-black">Price:</label>
                    <select
                        value={filters.maxPrice ?? ""}
                        onChange={(e) =>
                            updateFilter(
                                "maxPrice",
                                e.target.value ? Number(e.target.value) : null,
                            )
                        }
                        className="border text-black border-gray-300 rounded-lg px-3 py-2 flex-1"
                    >
                        <option value="">Any Price</option>
                        {priceOptions.map((p) => (
                            <option key={p} value={p}>
                                Under ${p}
                            </option>
                        ))}
                    </select>
                </span>

                <span className="flex flex-col text-xs">
                    <label className="text-black invisible">Reset</label>
                    <button
                        onClick={() => {
                            resetFilters();
                            setSearch("");
                        }}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                        Reset
                    </button>
                </span>
            </div>

            <div className="flex items-center justify-center">
                {searching && <p className="text-gray-500">Searching...</p>}
                {searchError && <p className="text-red-500">{searchError}</p>}
                {filteredProducts.length === 0 && !searching && (
                    <p className="text-gray-500">No products found</p>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 items-start">
                {filteredProducts.map((product) => (
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
