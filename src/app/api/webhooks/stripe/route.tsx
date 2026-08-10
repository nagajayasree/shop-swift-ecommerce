import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/features/components/checkout/stripe";
import { createOrder } from "@/features/lib/orders";
import { getProductById } from "@/features/lib/getProduct";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        );
    } catch (err) {
        return NextResponse.json(
            { error: "Invalid signature" },
            { status: 400 },
        );
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId) {
            console.error(
                "Webhook received checkout.session.completed with no userId in metadata",
                session.id,
            );
            return NextResponse.json(
                { error: "Missing userId in session metadata" },
                { status: 400 },
            );
        }
        const rawItems = JSON.parse(session.metadata?.items || "[]");

        const items = await Promise.all(
            rawItems.map(
                async (item: { productId: string; quantity: number }) => {
                    const product = await getProductById(item.productId);
                    return {
                        productId: item.productId,
                        name: product?.title ?? "Unknown product",
                        quantity: item.quantity,
                        priceAtPurchase: product?.price ?? 0,
                        image: product?.thumbnail,
                    };
                },
            ),
        );

        await createOrder({
            userId,
            stripeSessionId: session.id,
            items,
            total: (session.amount_total ?? 0) / 100,
            status: "paid",
            createdAt: new Date(),
        });
    }

    return NextResponse.json({ received: true });
}
