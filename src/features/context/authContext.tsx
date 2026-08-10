"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    updateProfile,
} from "firebase/auth";

import { auth } from "@/features/authentication/firebase";

import { User, Role } from "@/features/lib/types";

type SignUpData = {
    displayName: string;
    email: string;
    password: string;
};

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    role: Role;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (data: SignUpData) => Promise<void>;
    signOut: () => Promise<void>;
    isLoggedIn: boolean;
    error: string | null;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
    undefined,
);

const STORAGE_KEY = "auth"; // { user, role } — display data only, never tokens

type CachedAuth = { user: User; role: Role };

function readCache(): CachedAuth | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as CachedAuth) : null;
    } catch {
        return null;
    }
}

function writeCache(user: User, role: Role) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, role }));
    } catch {
        // ignore quota / private-mode errors
    }
}

function clearCache() {
    localStorage.removeItem(STORAGE_KEY);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
    // Hydrate synchronously from cache so there's no logged-out flash on refresh.
    // const cached = readCache();

    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<Role>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const cached = readCache();
        if (cached?.user) {
            setUser(cached.user);
            setRole(cached.role);
            setIsLoggedIn(true);
        }
        setHydrated(true);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const nextUser: User = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                };
                const cached = readCache();
                const nextRole: Role =
                    cached?.user?.uid.toString() === firebaseUser.uid &&
                    cached.role
                        ? cached.role
                        : "customer";

                setUser(nextUser);
                setRole(nextRole);
                setIsLoggedIn(true);
                writeCache(nextUser, nextRole);

                try {
                    const idToken = await firebaseUser.getIdToken();
                    await fetch("/api/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ idToken }),
                    });
                } catch {
                    // non-fatal — a later server request will 401 and surface it
                }
            } else {
                // Firebase says no session — cache was stale or user signed out
                setUser(null);
                setRole(null);
                setIsLoggedIn(false);
                clearCache();
            }
            setLoading(false);
        });

        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const signUp = async ({ displayName, email, password }: SignUpData) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );

            const idToken = await userCredential.user.getIdToken();

            // Firebase doesn't set displayName automatically — do it explicitly
            await updateProfile(userCredential.user, { displayName });

            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
            });

            if (!res.ok) throw new Error("Failed to establish session");

            const firebaseUser = userCredential.user;
            const nextUser: User = {
                uid: firebaseUser.uid as unknown as User["uid"],
                email: firebaseUser.email,
                displayName, // use the value we just set, since firebaseUser.displayName may not have refreshed locally yet
                photoURL: firebaseUser.photoURL,
            };
            setUser(nextUser);
            setIsLoggedIn(true);
            setRole("customer");
            setError(null);
            writeCache(nextUser, "customer");
        } catch (error: any) {
            const message = error?.message ?? "Failed to sign up";
            setError(message);
            throw error; // rethrow so callers (e.g. the form) know it failed
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const idToken = await userCredential.user.getIdToken();

            // Send token to server to set the session cookie
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
            });

            if (!res.ok) throw new Error("Failed to establish session");

            const firebaseUser = userCredential.user;
            const nextUser: User = {
                uid: firebaseUser.uid as unknown as User["uid"],
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
            };
            setUser(nextUser);
            setIsLoggedIn(true);
            setRole("customer");
            setError(null);
            writeCache(nextUser, "customer");
        } catch (error: any) {
            setError(error?.message ?? "Failed to sign in");
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth); // clears client SDK state
            await fetch("/api/logout", { method: "POST" }); // clears server cookie
            setUser(null);
            setIsLoggedIn(false);
            setRole(null);
            setError(null);
            clearCache();
        } catch (error: any) {
            setError(error?.message ?? "Failed to sign out");
            throw error;
        }
    };

    return (
        <AuthContext
            value={{
                user,
                role,
                signIn,
                signUp,
                signOut,
                isLoggedIn,
                loading,
                error,
            }}
        >
            {children}
        </AuthContext>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);

    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");

    return ctx;
}
