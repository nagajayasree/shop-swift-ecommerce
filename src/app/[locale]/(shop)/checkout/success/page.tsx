// app/checkout/success/page.tsx
import ClearCartOnSuccess from "@/features/components/checkout/ClearOnSuccess";
import { stripe } from "@/features/components/checkout/stripe";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";

interface SuccessPageProps {
    searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({
    searchParams,
}: SuccessPageProps) {
    const { session_id: sessionId } = await searchParams;
    
    if (!sessionId) {
        redirect("/");
    }
    
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items"],
    });
    
    const isPaid = session.payment_status === "paid";
    const t = await getTranslations();
    
    return (
        <div className="min-h-screen dark:bg-neutral-900 bg-neutral-50">
            <div className="max-w-2xl mx-auto py-16 px-4 text-center">
                {isPaid ? (
                    <>
                        <ClearCartOnSuccess />
                        <h1 className="text-2xl font-semibold mb-2 text-neutral-900 dark:text-white">
                            {t("SuccessPage.title")}
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            {t("SuccessPage.desc")}
                        </p>

                        <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 text-left mb-8 bg-white dark:bg-neutral-800 shadow-sm">
                            <div className="flex justify-between mb-2">
                                <span className="text-neutral-500 dark:text-neutral-400">
                                    {t("SuccessPage.orderTotal")}
                                </span>
                                <span className="font-medium text-neutral-900 dark:text-white">
                                    $
                                    {(
                                        (session.amount_total ?? 0) / 100
                                    ).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between mb-4">
                                <span className="text-neutral-500 dark:text-neutral-400">
                                    {t("SuccessPage.email")}
                                </span>
                                <span className="font-medium text-neutral-900 dark:text-white">
                                    {session.customer_details?.email}
                                </span>
                            </div>

                            <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                {session.line_items?.data.map((item) => (
                                    <li
                                        key={item.id}
                                        className="py-2 flex justify-between text-sm text-neutral-700 dark:text-neutral-300"
                                    >
                                        <span>
                                            {item.description} × {item.quantity}
                                        </span>
                                        <span>
                                            $
                                            {(
                                                (item.amount_total ?? 0) / 100
                                            ).toFixed(2)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/orders"
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-900 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 text-white rounded-md transition-colors"
                            >
                                {t("SuccessPage.viewMyOrders")}{" "}
                            </Link>
                            <Link
                                href="/"
                                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                            >
                                {t("CheckoutSuccessPage.continueShopping")}
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-semibold mb-2 text-neutral-900 dark:text-white">
                            {t("SuccessPage.paymentNotConfirmed")}
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            {t("SuccessPage.cantConfirmPayment")}
                        </p>
                        <Link
                            href="/cart"
                            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                        >
                            {t("SuccessPage.backToCart")}{" "}
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
