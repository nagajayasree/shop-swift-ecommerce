import { useCart } from "@/features/context/cartContext";
import { ProductProps } from "../types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import AddToCartButton from "@/app/[locale]/(shop)/products/[id]/AddToCartButton";

export default function ProductCard(product: ProductProps) {
    const { id, title, price, brand, rating, thumbnail } = product;
    const t = useTranslations();

    const { cartItems } = useCart();

    const cartItem = cartItems.find((item) => item.id === id);
    const quantity = cartItem?.quantity ?? 0;

    return (
        <div className="w-full self-start rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-100">
            <div className="relative w-full">
                <img
                    src={thumbnail}
                    alt={title}
                    className="block w-full h-56 object-cover"
                />
            </div>

            <div className="p-4">
                <Link key={id} href={`/products/${id}`}>
                    <p className="text-xs uppercase tracking-wide text-gray-400 font-medium">
                        {brand || "No Brand"}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900 mt-1 truncate">
                        {title}
                    </h3>
                    <div className="flex items-center mt-2">
                        <div className="flex text-amber-500 text-sm">
                            {"★".repeat(Math.trunc(rating))}
                            {"☆".repeat(5 - Math.floor(rating))}
                        </div>
                        <span className="text-sm text-gray-700 ml-1">
                            {rating}
                        </span>
                    </div>
                </Link>

                <div
                    className="flex items-baseline justify-between items-baseline mt-4"
                >
                    <span className="text-lg font-bold text-gray-900">
                        ${price.toFixed(2)}
                    </span>

                    <AddToCartButton
                        product={{ id, title, price, thumbnail }}
                        label={t("ProductCard.addToCart")}
                    />
                </div>
            </div>
        </div>
    );
}
