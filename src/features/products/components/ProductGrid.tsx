"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "../types";
import { useProductSearch } from "../hooks/useProductSearch";
import { useProductFilter } from "../hooks/useProductFilter";
import Link from "next/link";
import { useTranslations } from "next-intl";

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

    const t = useTranslations();

    return (
        <div className="p-6 dark:bg-neutral-900/100">
            <div className="flex gap-2 mb-6">
                <input
                    value={search}
                    placeholder={t("ProductsPage.searchPlaceholder")}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
                    className="border text-neutral-900 dark:text-white dark:border-gray-600 rounded-lg px-3 py-2 flex-1"
                />
                <button
                    onClick={fetchProducts}
                    className="border text-neutral-900 hover:text-white dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                    {t("ProductsPage.search")}
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                <span className="flex flex-col text-xs">
                    <label className="text-neutral-900 dark:text-white">
                        {t("ProductsPage.category")}:
                    </label>
                    <select
                        value={filters.category ?? ""}
                        onChange={(e) =>
                            updateFilter("category", e.target.value || null)
                        }
                        className="border text-neutral-900 dark:text-white dark:border-gray-600 rounded-lg px-3 py-2 flex-1"
                    >
                        <option value="">
                            {t("ProductsPage.allCategories")}
                        </option>
                        {categories.map((cat, index) => (
                            <option
                                key={index}
                                value={cat}
                                className="text-neutral-900 dark:text-white"
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                </span>

                <span className="flex flex-col text-xs">
                    <label className="text-neutral-900 dark:text-white">
                        {t("ProductsPage.brand")}:
                    </label>
                    <select
                        value={filters.brand ?? ""}
                        onChange={(e) =>
                            updateFilter("brand", e.target.value || null)
                        }
                        className="border text-neutral-900 dark:text-white dark:border-gray-600 rounded-lg px-3 py-2 flex-1"
                    >
                        <option value="">{t("ProductsPage.allBrands")}</option>
                        {brands.map((brand, index) => (
                            <option
                                key={index}
                                value={brand}
                                className="text-neutral-900 dark:text-white"
                            >
                                {brand}
                            </option>
                        ))}
                    </select>
                </span>

                <span className="flex flex-col text-xs">
                    <label className="text-neutral-900 dark:text-white">
                        {t("ProductsPage.rating")}:
                    </label>
                    <select
                        value={filters.minRating ?? ""}
                        onChange={(e) =>
                            updateFilter(
                                "minRating",
                                e.target.value ? Number(e.target.value) : null,
                            )
                        }
                        className="border text-neutral-900 dark:text-white dark:border-gray-600 rounded-lg px-3 py-2 flex-1"
                    >
                        <option value="">{t("ProductsPage.anyRating")}</option>
                        {ratingOptions.map((r) => (
                            <option
                                key={r}
                                value={r}
                                className="text-neutral-900 dark:text-white"
                            >
                                {r} {t("ProductsPage.star")}
                            </option>
                        ))}
                    </select>
                </span>

                <span className="flex flex-col text-xs">
                    <label className="text-neutral-900 dark:text-white">
                        {t("ProductsPage.price")}:
                    </label>
                    <select
                        value={filters.maxPrice ?? ""}
                        onChange={(e) =>
                            updateFilter(
                                "maxPrice",
                                e.target.value ? Number(e.target.value) : null,
                            )
                        }
                        className="border text-neutral-900 dark:text-white dark:border-gray-600 rounded-lg px-3 py-2 flex-1"
                    >
                        <option value="">{t("ProductsPage.anyPrice")}</option>
                        {priceOptions.map((p) => (
                            <option
                                key={p}
                                value={p}
                                className="text-neutral-900 dark:text-white"
                            >
                                {t("ProductsPage.under")} ${p}
                            </option>
                        ))}
                    </select>
                </span>

                <span className="flex flex-col text-xs">
                    <label className="text-neutral-900 dark:text-white invisible">
                        {t("ProductsPage.reset")}
                    </label>
                    <button
                        onClick={() => {
                            resetFilters();
                            setSearch("");
                        }}
                        className="border text-neutral-900 hover:text-white dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                        {t("ProductsPage.reset")}
                    </button>
                </span>
            </div>

            <div className="bg-white/80 dark:bg-neutral-900/100 flex items-center justify-center">
                {searching && (
                    <p className="text-gray-500">
                        {t("ProductsPage.searching")}
                    </p>
                )}
                {searchError && <p className="text-red-500">{searchError}</p>}
                {filteredProducts.length === 0 && !searching && (
                    <p className="text-gray-500">
                        {t("ProductsPage.productsNotFound")}
                    </p>
                )}
            </div>

            <div className="bg-white/80 dark:bg-neutral-900/100 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 items-start">
                {filteredProducts.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`}>
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
                    </Link>
                ))}
            </div>
        </div>
    );
}
