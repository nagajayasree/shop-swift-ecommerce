"use client";

import { useEffect, useState } from "react";
import ProductCard from './ProductCard';
import { Product } from "../types";

export default function ProductGrid(){
        const [products, setProducts] = useState<Product[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');

        useEffect(()=>{
	    const fetchData = async () => {
            try{
                const response = await fetch('https://dummyjson.com/products');
                const data = await response.json();
                setProducts(data.products);
                setLoading(false);
            }
            catch(err){
                setError('Failed to fetch data');
            }
        };
        fetchData();
    },[]);

       return(
    <div className="p-6">
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 items-start">
            {products && products.map((product) => (
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
)}