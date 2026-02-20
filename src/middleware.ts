import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
    process.env.AUTH_SECRET || "clinical-safety-secret-default-key-12345"
);

const COOKIE_NAME = "hand_talk_session";

/**
 * Hand Talk Auth Middleware
 * Clinical justification: Ensures only authorized radiographers 
 * can access session management and dashboard controls.
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Paths requiring authentication
    const protectedPaths = ['/dashboard'];
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtected) {
        const session = request.cookies.get(COOKIE_NAME)?.value;

        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            await jwtVerify(session, SECRET);
            return NextResponse.next();
        } catch {
            // Invalid or expired session
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete(COOKIE_NAME);
            return response;
        }
    }

    // Redirect to dashboard if logged in and trying to access login page
    if (pathname === '/login') {
        const session = request.cookies.get(COOKIE_NAME)?.value;
        if (session) {
            try {
                await jwtVerify(session, SECRET);
                return NextResponse.redirect(new URL('/dashboard', request.url));
            } catch {
                // Continue to login if session is invalid
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
