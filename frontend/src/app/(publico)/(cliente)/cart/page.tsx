import CartClient from '@/features/cart/CartClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tu carrito',
}

export default function CartPage() {
  return <CartClient />
}
