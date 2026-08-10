"use client";

import { User } from "@/features/lib/types";

export const getCurrentUserClient = async (): Promise<User | null> => {
    const res = await fetch("/api/current-user", {
        credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.user as User | null;
};
