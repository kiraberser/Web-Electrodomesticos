import './globals.css'

import Head from 'next/head'
import Script from 'next/script'

import { Inter } from 'next/font/google'
import { Navbar, Footer } from '@/components/ui'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <Head>
        <Script src="/path/or/uri/to/tinymce.min.js" referrerPolicy="origin"></Script>
      </Head>
      <body className={`${inter.className} min-h-screen`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}