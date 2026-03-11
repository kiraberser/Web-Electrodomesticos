import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isAdminFromJWT(jwt?: string): boolean {
    if (!jwt) return false;
    try {
        const base64 = jwt.split('.')[1] || '';
        const json = Buffer.from(base64, 'base64').toString('utf8');
        const payload = JSON.parse(json);
        return Boolean(
            payload?.is_staff || payload?.is_admin || payload?.is_superuser || payload?.role === 'admin'
        );
    } catch {
        return false;
    }
}

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const username = req.cookies.get('username')?.value;
    const refreshToken = req.cookies.get('refresh_cookie')?.value;

    // Si username existe pero refresh_cookie no → la sesión expiró o fue borrada
    // parcialmente. Eliminamos username para que el cliente quede desautenticado.
    const sessionDesync = !!username && !refreshToken;

    // Protección de rutas /admin
    if (pathname.startsWith('/admin')) {
        const access = req.cookies.get('access_cookie')?.value;
        if (!access || !isAdminFromJWT(access)) {
            const url = new URL('/admin/unauthorized', req.url);
            url.searchParams.set('next', pathname);
            const redirect = NextResponse.redirect(url);
            if (sessionDesync) redirect.cookies.delete('username');
            return redirect;
        }
    }

    const response = NextResponse.next();
    if (sessionDesync) {
        response.cookies.delete('username');
    }
    return response;
}

export const config = {
    // Aplica a todas las rutas excepto archivos estáticos e imágenes
    matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
