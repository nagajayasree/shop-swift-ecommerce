import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/account", "/orders", "/checkout"];
const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/login", "/signup"];

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get("session")?.value;
    const { pathname } = request.nextUrl;

    const isAdminRoute = ADMIN_ROUTES.some((route) =>
        pathname.startsWith(route),
    );
    const isProtected = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route),
    );
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

    // No session, hitting a protected or admin route → redirect to login
    if ((isProtected || isAdminRoute) && !sessionCookie) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAdminRoute && sessionCookie) {
        const role = getRoleFromSession(sessionCookie);
        if (role !== "admin") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    if (isAuthRoute && sessionCookie) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

function getRoleFromSession(sessionCookie: string): string | null {
    try {
        return null;
    } catch {
        return null;
    }
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
