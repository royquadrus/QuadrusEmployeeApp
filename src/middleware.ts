import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "./lib/supabase/server";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = await createServerSupabaseClient();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Protected routes pattern
    const protectedPaths = ['/dashboard', '/timeclock'];
    const isProtectedRoute = protectedPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    );
    const isAuthRoute = request.nextUrl.pathname.startsWith('/login')

    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAuthRoute && session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;
}

export const config = {
    matcher: [
    "/api/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}