import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isAdminFromJWT(jwt?: string): boolean {
    if (!jwt) return false;
    try {
        const base64 = jwt.split('.')[1] || '';
        const json = Buffer.from(base64, 'base64').toString('utf8');
        const payload = JSON.parse(json);
        console.log(payload);
        return Boolean(
            payload?.is_staff || payload?.is_admin || payload?.is_superuser || payload?.role === 'admin'
        );
    } catch {
        return false;
    }
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    if (!pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    const access = req.cookies.get('access_cookie')?.value;
  if (!access || !isAdminFromJWT(access)) {
    const url = new URL('/admin/unauthorized', req.url);
        url.searchParams.set('next', pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
