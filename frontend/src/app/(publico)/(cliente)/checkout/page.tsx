import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { getDireccionesAction } from '@/features/auth/actions'
import CheckoutFlow from '@/features/checkout/CheckoutFlow'
import type { Direccion } from '@/shared/types/user'

// Skeleton while CheckoutFlow hydrates (Vercel: async-suspense-boundaries)
function CheckoutSkeleton() {
    return (
        <main className="min-h-screen bg-[#f8fafc]">
            <div className="container mx-auto max-w-2xl px-4 py-8">
                <div className="mb-8 text-center animate-pulse">
                    <div className="h-7 w-48 bg-gray-200 rounded-full mx-auto" />
                    <div className="h-4 w-64 bg-gray-100 rounded-full mx-auto mt-2" />
                </div>
                <div className="flex justify-center gap-4 mb-8">
                    {[1, 2, 3].map(n => (
                        <div key={n} className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
                            {n < 3 && <div className="h-0.5 w-20 bg-gray-200" />}
                        </div>
                    ))}
                </div>
                <div className="space-y-4">
                    <div className="h-24 rounded-2xl bg-white border border-gray-100 animate-pulse" />
                    <div className="h-64 rounded-2xl bg-white border border-gray-100 animate-pulse" />
                    <div className="h-20 rounded-2xl bg-white border border-gray-100 animate-pulse" />
                    <div className="h-12 rounded-xl bg-gray-200 animate-pulse" />
                </div>
            </div>
        </main>
    )
}

export default async function CheckoutPage() {
    const cookieStore = await cookies()
    const username = cookieStore.get('username')?.value
    const isAuthenticated = !!username

    // Only fetch addresses if authenticated — defer await to branch (Vercel: async-defer-await + server-parallel-fetching)
    let initialAddresses: Direccion[] = []
    let initialEmail: string | undefined

    if (isAuthenticated) {
        const response = await getDireccionesAction()
        initialAddresses = response.success && response.data ? (response.data as Direccion[]) : []
        // Email pre-fill for registered users would come from user profile (not fetched here to avoid extra waterfall)
    }

    return (
        <Suspense fallback={<CheckoutSkeleton />}>
            <CheckoutFlow
                isAuthenticated={isAuthenticated}
                initialAddresses={initialAddresses}
                initialEmail={initialEmail}
            />
        </Suspense>
    )
}
