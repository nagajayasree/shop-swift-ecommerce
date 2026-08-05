"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    updateProfile,
} from "firebase/auth";
import { auth } from "@/features/authentication/firebase";

type User = {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
};

type SignUpData = {
    displayName: string;
    email: string;
    password: string;
};

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    role: "customer" | "admin" | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (data: SignUpData) => Promise<void>;
    signOut: () => Promise<void>;
    isLoggedIn: boolean;
    error: string | null;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
    undefined,
);

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<"customer" | "admin" | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName, // use the value we just set, since firebaseUser.displayName may not have refreshed locally yet
                photoURL: firebaseUser.photoURL,
            });
            setIsLoggedIn(true);
            setRole("customer");
            setError(null);
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
            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
            });
            setIsLoggedIn(true);
            setRole("customer");
            setError(null);
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
            // const logoutRes = await fetch("/api/logout", { method: "POST" });
            // console.log("Logout status:", logoutRes.status);
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
