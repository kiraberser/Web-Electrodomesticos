import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

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
      <body className={`${inter.className} min-h-screen`}>
      <Navbar/>
        {children}
      <Footer/>
      </body>
    </html>
  )
}