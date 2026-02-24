// app/layout.tsx
import '@/styles/index.css'

import { cookies } from 'next/headers';
import { AppChrome } from '@/shared/layout/AppChrome';

import { Inter } from 'next/font/google';
// Navbar y Footer se inyectan vía AppChrome según la ruta
import { CartProvider } from '@/features/cart/CartContext';
import RouteModalGate from '@/shared/layout/RouteModalGate';
import WhatsAppButton from '@/shared/layout/WhatsAppButton';
import type { Metadata, Viewport } from 'next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://refaccionariavega.com'),
  title: {
    template: '%s | Refaccionaria Vega',
    default: 'Refaccionaria Vega — Refacciones y Electrodomésticos',
  },
  description: 'Refacciones y electrodomésticos de calidad en Martínez de la Torre, Veracruz. Envío a toda la república.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://refaccionariavega.com',
    siteName: 'Refaccionaria Vega',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Refaccionaria Vega' }],
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
  return (
    <html lang="es-MX" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className={`${inter.className} text-[#0A3981]`}>
        <CartProvider>
          <AppChrome username={username || undefined}>
            {children}
          </AppChrome>
          <RouteModalGate />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}

