import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/features/authentication/firebaseAdmin";

export async function POST(request: NextRequest) {
    const { idToken } = await request.json();

    if (!idToken) {
        return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    try {
        // Verify the token is genuine before trusting it
        await adminAuth.verifyIdToken(idToken);

        const sessionCookie = await adminAuth.createSessionCookie(idToken, {
            expiresIn: 60 * 60 * 24 * 5 * 1000,
        });

        const response = NextResponse.json({ status: true });

        response.cookies.set("session", sessionCookie, {
            maxAge: 60 * 60 * 24 * 5,
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