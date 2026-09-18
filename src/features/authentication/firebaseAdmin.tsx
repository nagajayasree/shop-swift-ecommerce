import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";

let app: App | null = null;

function getAdminApp(): App {
    if (app) return app;

    const existing = getApps();
    if (existing.length) {
        app = existing[0];
        return app;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
            "Firebase Admin env vars missing: FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY",
        );
    }

    app = initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
    });
    return app;
}

export const adminAuth = new Proxy({} as Auth, {
    get(_target, prop) {
        const auth = getAuth(getAdminApp()) as unknown as Record<
            string | symbol,
            unknown
        >;
        const value = auth[prop];
        return typeof value === "function" ? value.bind(auth) : value;
    },
});
