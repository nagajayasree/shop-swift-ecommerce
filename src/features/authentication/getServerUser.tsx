import { cookies } from "next/headers";
import { adminAuth } from "./firebaseAdmin";

export async function getServerUser() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) return null;

    try {
        // `true` = check for revocation, not just expiry
        const decodedClaims = await adminAuth.verifySessionCookie(
            sessionCookie,
            true,
        );
        return decodedClaims; // contains uid, email, custom claims (role), etc.
    } catch (error) {
        // Cookie invalid, expired, or revoked
        console.error("Error verifying session cookie:", error);
        return null;
    }
}
