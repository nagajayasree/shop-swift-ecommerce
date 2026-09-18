import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/features/components/checkout/stripe";
import { getProductById } from "@/features/lib/getProduct";
import { getCurrentUser } from "@/features/authentication/getCurrentUser";

export async function POST(req: NextRequest) {
    const session = await getCurrentUser();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json();

    const lineItems = await Promise.all(
        items.map(async (item: { productId: string; quantity: number }) => {
            const product = await getProductById(item.productId);
            if (!product)
                throw new Error(`Product ${item.productId} not found`);

            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.title,
                        images: [product.thumbnail],
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: item.quantity,
            };
        }),
    );

    const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ??
        (process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000");

    const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: lineItems,
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/products/cart`,
        metadata: {
            userId: session.user.uid?.toString() || "",
            items: JSON.stringify(items),
        },
    });

    return NextResponse.json({ url: checkoutSession.url });
}
