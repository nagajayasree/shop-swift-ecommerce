import { ObjectId } from "mongodb";

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

export interface OrderItem {
    productId: string;
    quantity: number;
    name: string;
    priceAtPurchase: number;
}

export interface Order {
    _id?: ObjectId;
    userId: string;
    stripeSessionId: string;
    items: OrderItem[];
    total: number;
    status: "pending" | "paid" | "fulfilled" | "cancelled";
    createdAt: Date;
}

export type Role = "customer" | "admin" | null;

export type User = {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role?: "customer" | "admin"; // optional, can be set via custom claims in Firebase
};
