import { NextRequest, NextResponse } from "next/server";
import { getMongoClient } from "@/features/lib/mongodb";
import { getCurrentUser } from "@/features/authentication/getCurrentUser";

// Temporary diagnostic endpoint — remove once the orders-page 500 is fixed.
// Gated behind DEBUG_SECRET so it 404s for anyone who doesn't have it.
export async function GET(req: NextRequest) {
    const secret = process.env.DEBUG_SECRET;
    if (!secret || req.nextUrl.searchParams.get("secret") !== secret) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const result: Record<string, unknown> = {};

    try {
        const client = await getMongoClient();
        await client.db().command({ ping: 1 });
        result.mongo = { ok: true };
    } catch (err) {
        result.mongo = { ok: false, error: (err as Error).message };
    }

    try {
        const session = await getCurrentUser();
        result.auth = { ok: true, loggedIn: !!session };
    } catch (err) {
        result.auth = { ok: false, error: (err as Error).message };
    }

    result.env = {
        MONGODB_URI: !!process.env.MONGODB_URI,
        MONGODB_DB_NAME: process.env.MONGODB_DB_NAME ?? null,
        FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
        FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
        FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
    };

    return NextResponse.json(result);
}
