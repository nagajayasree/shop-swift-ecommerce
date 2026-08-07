export type Product = {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    rating: number;
    stock: number;
    brand: string;
    thumbnail: string;
    slug: string;
    reviews?: Review[];
};

export type Review = {
    rating: number;
    comment: string;
    date: string;
    reviewerEmail: string;
    reviewerName: string;
};

export type ProductProps = {
    id: number;
    title: string;
    description?: string;
    category: string;
    price: number;
    thumbnail: string;
    brand: string;
    rating: number;
};

export type CartProduct = Pick<Product, "id" | "title" | "price" | "thumbnail">;
