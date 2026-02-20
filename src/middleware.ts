import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from "jose";
import { routing } from './routing';

const SECRET = new TextEncoder().encode(
    process.env.AUTH_SECRET || "clinical-safety-secret-default-key-12345"
);

const COOKIE_NAME = "hand_talk_session";

const i18nMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Run i18n middleware
    const response = i18nMiddleware(request);

    // 2. Clinical Auth Logic
    const isProtectedPath = routing.locales.some((locale: string) =>
        pathname.startsWith(`/${locale}/dashboard`)
    );

    if (isProtectedPath) {
        const session = request.cookies.get(COOKIE_NAME)?.value;

        if (!session) {
            const locale = pathname.split('/')[1] || routing.defaultLocale;
            return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
        }

        try {
            await jwtVerify(session, SECRET);
            return response;
        } catch {
            const locale = pathname.split('/')[1] || routing.defaultLocale;
            const res = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
            res.cookies.delete(COOKIE_NAME);
            return res;
        }
    }

    const isLoginPath = routing.locales.some((locale: string) =>
        pathname.startsWith(`/${locale}/login`)
    );

    if (isLoginPath) {
        const session = request.cookies.get(COOKIE_NAME)?.value;
        if (session) {
            try {
                await jwtVerify(session, SECRET);
                const locale = pathname.split('/')[1] || routing.defaultLocale;
                return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
            } catch {
                // Continue to login
            }
        }
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
