import { cookies } from "next/headers";
import { adminAuth } from "@/features/authentication/firebaseAdmin";
import { User, Role } from "@/features/lib/types";
import { ObjectId } from "mongodb";

export const getCurrentUser = async (): Promise<{
    user: User;
    role: Role;
} | null> => {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(
            sessionCookie,
            true,
        );

        console.log("session verified for uid:", decodedClaims.uid);

        const user: User = {
            uid: decodedClaims.uid,
            email: decodedClaims.email ?? null,
            displayName: decodedClaims.name ?? null,
            photoURL: decodedClaims.picture ?? null,
        };

        const role: Role = (decodedClaims.role as Role) ?? "customer";

        return { user, role };
    } catch (err) {
        console.error("verifySessionCookie failed:", err);
        return null;
    }
};
