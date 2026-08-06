import { notFound } from "next/navigation";
import { getProductById } from "@/features/products/lib/products";
import { Review } from "@/features/products/types";
import { getTranslations } from "next-intl/server";

export default async function ProductDetails({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    const t = await getTranslations();

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Product section */}
            <div className="grid md:grid-cols-2 gap-12">
                <div className="bg-neutral-50 rounded-2xl overflow-hidden flex items-center justify-center">
                    <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex flex-col justify-center">
                    <span className="text-xs font-medium tracking-wide uppercase text-neutral-400">
                        {product.brand}
                    </span>

                    <h1 className="text-3xl text-neutral-900 dark:text-white font-semibold text-neutral-900 leading-tight mt-2">
                        {product.title}
                    </h1>

                    <div className="flex items-center gap-2 mt-3">
                        <div className="flex text-amber-500 text-sm">
                            {"★".repeat(Math.round(product.rating))}
                            {"☆".repeat(5 - Math.floor(product.rating))}
                        </div>
                        <span className="text-sm text-neutral-500">
                            {product.rating.toFixed(2)}{" "}
                            {t("ProductDetails.reviews")}
                        </span>
                    </div>

                    <p className="text-2xl text-neutral-900 dark:text-white font-semibold text-neutral-900 mt-6">
                        ${product.price}
                    </p>

                    <p className="text-neutral-600 leading-relaxed mt-4">
                        {product.description}
                    </p>

                    <button className="border mt-8 w-full md:w-fit px-8 py-3 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-700 transition-colors">
                        {t("ProductDetails.addToCart")}
                    </button>
                </div>
            </div>

            {/* Reviews section — now correctly outside the product grid */}
            <div className="mt-20 border-t border-neutral-200 pt-10">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
                    {t("ProductDetails.reviews")} (
                    {product.reviews?.length ?? 0})
                </h2>

                {product.reviews && product.reviews.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {product.reviews.map((review: Review, idx: number) => (
                            <div
                                key={idx}
                                className="border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 hover:shadow-sm transition-all"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-neutral-900 dark:text-white text-sm">
                                        {review.reviewerName}
                                    </span>
                                    <div className="flex text-amber-500 text-xs">
                                        {"★".repeat(review.rating)}
                                        {"☆".repeat(5 - review.rating)}
                                    </div>
                                </div>

                                <p className="text-neutral-600 text-sm leading-relaxed">
                                    {review.comment}
                                </p>

                                <p className="text-neutral-400 text-xs mt-3">
                                    {new Date(review.date).toLocaleDateString(
                                        "en-US",
                                        {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        },
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-neutral-500 text-sm">No reviews yet.</p>
                )}
            </div>
        </div>
    );
}
