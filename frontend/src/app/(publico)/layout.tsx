// app/layout.tsx
import '@/styles/index.css'

import { cookies } from 'next/headers';
import { AppChrome } from '@/components/features/layout/AppChrome';

import { Inter } from 'next/font/google';
// Navbar y Footer se inyectan vía AppChrome según la ruta
import { CartProvider } from '@/context/CartContext';
import RouteModalGate from '@/components/public/RouteModalGate';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookiesStore = await cookies();
  const username = cookiesStore.get('username')?.value || null;
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <title>
          Refaccionaria "Vega"
        </title>
      </head>
      <body className={`${inter.className} text-[#0A3981]`}>
        <CartProvider>
          <AppChrome username={username || undefined}>
            {children}
          </AppChrome>
          <RouteModalGate />
        </CartProvider>
      </body>
    </html>
  );
}

