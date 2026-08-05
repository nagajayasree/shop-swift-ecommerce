"use client";

import { useState, SubmitEvent } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/features/context/authContext";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [error, setError] = useState("");

    const { signUp } = useAuth();

    const router = useRouter();

    const onHandleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            const result = await signUp(
                { displayName: name, email: email, password: password },
                // idToken,
            );

            router.refresh();
            setName("");
            setEmail("");
            setPassword("");
            setShowPassword(false);
        } catch (error: unknown) {
            console.error(error);
            setError(error instanceof Error ? error.message : String(error));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center dark:bg-neutral-900/100 px-4">
            <div className="w-full max-w-xl dark:bg-neutral-900/100 rounded-2xl border dark:border-gray-600 p-8 shadow-2xl">
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                        Create an account
                    </h3>
                </div>

                <form onSubmit={onHandleSubmit} className="space-y-4">
                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-neutral-900 dark:text-white">
                            Full name
                        </span>
                        <input
                            type="text"
                            name="fullName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Jane Doe"
                            className="w-full rounded-xl border dark:border-gray-600 px-4 py-3 text-neutral-900 dark:text-white placeholder:text-slate-500 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-neutral-900 dark:text-white">
                            Email
                        </span>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="jane@example.com"
                            className="w-full rounded-xl border dark:border-gray-600 px-4 py-3 text-neutral-900 dark:text-white placeholder:text-slate-500 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-neutral-900 dark:text-white">
                            Password
                        </span>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 8 characters"
                                className="w-full rounded-xl border dark:border-gray-600 px-4 py-3 text-neutral-900 dark:text-white placeholder:text-slate-500 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-slate-200"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>

                        <span className="text-red-400 text-sm">{error}</span>
                    </label>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-sky-600 px-4 py-3 font-medium text-white transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                    >
                        Create account
                    </button>

                    <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="text-slate-400">
                            Already have an account?
                        </span>
                        <Link
                            href={"/login"}
                            className="text-sky-400 hover:text-sky-300"
                        >
                            Log in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
