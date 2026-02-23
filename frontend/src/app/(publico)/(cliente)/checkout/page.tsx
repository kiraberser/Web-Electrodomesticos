import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getDireccionesAction } from '@/features/auth/actions'
import CheckoutClient from './CheckoutClient'
import type { Direccion } from '@/shared/types/user'

export default async function CheckoutPage() {
    const cookieStore = await cookies()
    const username = cookieStore.get('username')?.value
    if (!username) redirect('/cuenta/login')

    const response = await getDireccionesAction()
    const addresses: Direccion[] = response.success && response.data
        ? (response.data as Direccion[])
        : []

    return <CheckoutClient initialAddresses={addresses} />
}
