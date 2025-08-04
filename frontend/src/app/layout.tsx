import './globals.css'

import Script from 'next/script'
import { cookies } from 'next/headers'


import { Inter } from 'next/font/google'
import { Navbar, Footer } from '@/components/ui'
import { CartProvider } from '@/context/CartContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default async function RootLayout({children,}: {children: React.ReactNode}) 
{
  const cookiesStore = await cookies()
  const username = cookiesStore.get('username')?.value || null

  return (
    <html lang="es" className={inter.variable}>
      <head>
        <Script src="/path/or/uri/to/tinymce.min.js" referrerPolicy="origin"></Script>
      </head>
      <body className={`${inter.className} min-h-screen text-[#0A3981]`}>
        <CartProvider>
          <Navbar username={username} />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}