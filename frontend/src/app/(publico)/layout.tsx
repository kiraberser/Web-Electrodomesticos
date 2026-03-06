// app/layout.tsx
import '@/styles/index.css'

import { cookies } from 'next/headers';
import { AppChrome } from '@/shared/layout/AppChrome';

import { Inter } from 'next/font/google';
// Navbar y Footer se inyectan vía AppChrome según la ruta
import { CartProvider } from '@/features/cart/CartContext';
import { FavoritesProvider } from '@/features/favorites/FavoritesContext';
import RouteModalGate from '@/shared/layout/RouteModalGate';
import WhatsAppButton from '@/shared/layout/WhatsAppButton';
import type { Metadata, Viewport } from 'next';
import { getIsAdminFromToken } from '@/shared/lib/jwt.server';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.refaccionariavega.com.mx'),
  title: {
    template: '%s | Refaccionaria Vega',
    default: 'Refaccionaria Vega — Refacciones y Electrodomésticos',
  },
  description: 'Refacciones y electrodomésticos de calidad en Martínez de la Torre, Veracruz. Envío a toda la república.',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://www.refaccionariavega.com.mx',
    siteName: 'Refaccionaria Vega',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookiesStore = await cookies();
  const username = cookiesStore.get('username')?.value || null;
  const isAdmin = getIsAdminFromToken(cookiesStore.get('access_cookie')?.value);
  return (
    <html lang="es-MX" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className={`${inter.className} text-[#0A3981]`}>
        <CartProvider>
          <FavoritesProvider>
            <AppChrome username={username || undefined} isAdmin={isAdmin}>
              {children}
            </AppChrome>
            <RouteModalGate />
            <WhatsAppButton />
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}

