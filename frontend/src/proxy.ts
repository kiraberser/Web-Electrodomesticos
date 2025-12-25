// frontend/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwtPayload(jwt?: string): Record<string, unknown> | null {
    if (!jwt) return null;
    try {
        const part = (jwt.split('.')[1] || '').replace(/-/g, '+').replace(/_/g, '/');
        const padded = part + '='.repeat((4 - (part.length % 4)) % 4);
        const json = atob(padded);
        return JSON.parse(json);
    } catch {
        return null;
    }
}

function isAdminFromJWT(jwt?: string): boolean {
    const payload = decodeJwtPayload(jwt);
    if (!payload) return false;
    return Boolean(
        payload?.is_staff || payload?.is_admin || payload?.is_superuser || payload?.role === 'admin'
    );
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Permitir la propia página de no autorizado
    if (!pathname.startsWith('/admin') || pathname.startsWith('/admin/unauthorized')) {
        return NextResponse.next();
    }

    const access = req.cookies.get('access_cookie')?.value;
    const isAdmin = isAdminFromJWT(access);

    if (!isAdmin) {
        const accept = req.headers.get('accept') || '';
        if (accept.includes('text/html')) {
            const url = req.nextUrl.clone();
            url.pathname = '/unauthorized';
            url.searchParams.set('next', pathname);
            return NextResponse.redirect(url);
        }
        return new NextResponse(null, { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin', '/admin/:path*'],
};