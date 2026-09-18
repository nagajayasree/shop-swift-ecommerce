import "server-only";

import { getMongoClient } from "@/features/lib/mongodb";
import { Order } from "@/features/lib/types";

export async function getOrders(): Promise<Order[]> {
    const client = await getMongoClient();
    const db = client.db("swift-shop-database");

    const orders = await db
        .collection<Omit<Order, "_id">>("orders")
        .find({})
        .toArray();

    return orders.map((order) => ({
        _id: order._id,
        userId: order.userId,
        stripeSessionId: order.stripeSessionId,
        items: order.items,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
    }));
}
