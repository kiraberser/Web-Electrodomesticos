// app/layout.tsx
import '@/styles/index.css'

import { cookies } from 'next/headers';

import { Inter } from 'next/font/google';
import { Navbar, Footer } from '@/components/ui';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// Modifica la interfaz para aceptar un prop 'hideNavFooter'
interface RootLayoutProps {
  children: React.ReactNode;
  hideNavFooter?: boolean; // Prop opcional para ocultar nav y footer
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
          <Navbar username={username || undefined} />
          {children}
          <Footer username={username || undefined}/>
        </CartProvider>
      </body>
    </html>
  );
}