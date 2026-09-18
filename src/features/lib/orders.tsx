import { ObjectId } from "mongodb";
import { Order } from "@/features/lib/types";
import { getMongoClient } from "@/features/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB_NAME || "swift-shop-db";

export async function createOrder(order: Omit<Order, "_id">) {
    // const client = await clientPromise;
    const client = await getMongoClient();
    const db = client.db(DB_NAME);

    const existing = await db.collection("orders").findOne({
        stripeSessionId: order.stripeSessionId,
    });
    if (existing) return existing;

    const result = await db.collection("orders").insertOne(order);
    return { ...order, _id: result.insertedId };
}

export async function getOrdersByUserId(userId: string) {
    // const client = await clientPromise;
    const client = await getMongoClient();
    const db = client.db(DB_NAME);

    return db
        .collection("orders")
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();
}

export async function getOrderById(orderId: string) {
    const client = await getMongoClient();
    const db = client.db(DB_NAME);

    return db.collection("orders").findOne({ _id: new ObjectId(orderId) });
}
