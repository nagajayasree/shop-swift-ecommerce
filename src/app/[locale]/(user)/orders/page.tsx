import { getOrdersByUserId } from "@/features/lib/orders";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/authentication/getCurrentUser";
import { getTranslations } from "next-intl/server";

export default async function Orders() {
    const session = await getCurrentUser();
    if (!session) redirect("/login");
    const orders = await getOrdersByUserId(session.user.uid);

    const t = await getTranslations();

    console.log(orders);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-lg font-bold mt-6 text-gray-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white">
                {t("OrdersPage.title")}
            </h1>

            {orders.length === 0 ? (
                <p className="text-gray-500 dark:text-neutral-400">
                    t{"OrderPage.noOrders"}{" "}
                </p>
            ) : (
                <div className="w-full max-w-2xl px-4">
                    {orders.map((order: any) => (
                        <div
                            key={order._id.toString()}
                            className="p-4 mb-4 border rounded-lg shadow-md bg-white dark:bg-neutral-800"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Order #{order._id.toString().slice(-8)}
                                </h2>
                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                        order.status === "paid"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {order.status}
                                </span>
                            </div>

                            <p className="text-gray-600 dark:text-neutral-300 text-sm mb-1">
                                {t("OrdersPage.orderPlaced")}
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>

                            <ul className="my-3 divide-y divide-gray-100 dark:divide-neutral-700">
                                {order.items.map((item: any, i: number) => (
                                    <li
                                        key={i}
                                        className="py-2 flex justify-between text-sm text-gray-700 dark:text-neutral-300"
                                    >
                                        <span>
                                            <span>
                                                {item.name} × {item.quantity}
                                            </span>{" "}
                                        </span>
                                        <span>
                                            $
                                            {(
                                                item.priceAtPurchase *
                                                item.quantity
                                            ).toFixed(2)}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <p className="text-right font-semibold text-gray-800 dark:text-white">
                                Total: ${order.total.toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
