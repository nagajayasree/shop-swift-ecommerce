import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/features/authentication/firebaseAdmin";

const SESSION_EXPIRY_MS = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function POST(request: NextRequest) {
    const { idToken } = await request.json();

    if (!idToken) {
        return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    try {
        // Verify the token is genuine before trusting it
        await adminAuth.verifyIdToken(idToken);

        const sessionCookie = await adminAuth.createSessionCookie(idToken, {
            expiresIn: SESSION_EXPIRY_MS,
        });

        const response = NextResponse.json({ status: "success" });

        response.cookies.set("session", sessionCookie, {
            maxAge: SESSION_EXPIRY_MS / 1000, // seconds, not ms
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
        });

        return response;
    } catch (error) {
        console.error("Session login error:", error);
        return NextResponse.json(
            { error: "Failed to create session" },
            { status: 401 },
        );
    }
}