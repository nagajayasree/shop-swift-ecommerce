import { Product } from "../types";

export async function getProductById(id: string): Promise<Product | null> {
  const res = await fetch(`https://dummyjson.com/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}