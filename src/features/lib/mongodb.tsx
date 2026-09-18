import { MongoClient } from "mongodb";

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

export function getMongoClient(): Promise<MongoClient> {
    if (clientPromise) return clientPromise;

    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not set");

    if (process.env.NODE_ENV === "development") {
        // Reuse across hot reloads so dev doesn't open a new pool per edit.
        global._mongoClientPromise ??= new MongoClient(uri).connect();
        clientPromise = global._mongoClientPromise;
    } else {
        clientPromise = new MongoClient(uri).connect();
    }

    return clientPromise;
}