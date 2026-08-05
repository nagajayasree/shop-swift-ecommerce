import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/shop", "/account", "/admin"];
const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/login", "/register"]; // redirect away if already logged in

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get("session")?.value;
    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route),
    );
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

    // No session cookie, trying to hit a protected route → redirect to login
    if (isProtected && !sessionCookie) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Has a session cookie, trying to hit login/register → send to shop
    if (isAuthRoute && sessionCookie) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

// export const config = {
//     matcher: [
//         "/shop/:path*",
//         "/account/:path*",
//         "/admin/:path*",
//         "/signup",
//         "/login",
//     ],
// };
