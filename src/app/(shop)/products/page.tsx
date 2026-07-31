import ProductGrid from '@/features/products/components/ProductGrid';
import { Product } from '@/features/products/types';

async function getProducts(): Promise<Product[]> {
    const res = await fetch("https://dummyjson.com/products?limit=0");

    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }

    const data = await res.json();
    return data.products;
}

export default async function ShopPage() {
    const products = await getProducts();
    return <ProductGrid initialProducts={products} />;
}
