'use client'

import { useTransition } from 'react'
import { CheckoutProvider } from '@/features/checkout/CheckoutProvider'
import CheckoutStepIndicator from '@/features/checkout/CheckoutStepIndicator'
import Step1ShippingForm from '@/features/checkout/Step1ShippingForm'
import Step2Payment from '@/features/checkout/Step2Payment'
import Step3Confirmation from '@/features/checkout/Step3Confirmation'
import { useCheckoutContext } from '@/features/checkout/CheckoutProvider'
import type { Direccion } from '@/shared/types/user'

interface Props {
    isAuthenticated: boolean
    initialAddresses: Direccion[]
    initialEmail?: string
}

// Inner component — consumes context
function CheckoutContent({ initialAddresses }: { initialAddresses: Direccion[] }) {
    const { state } = useCheckoutContext()
    const [, startTransition] = useTransition()

    return (
        <main className="min-h-screen bg-[#f8fafc]">
            <div className="container mx-auto max-w-2xl px-4 py-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-[#0A3981]">Finalizar compra</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Refaccionaria Vega — envíos a todo México
                    </p>
                </div>

                {/* Step indicator */}
                <CheckoutStepIndicator currentStep={state.step} />

                {/* Active step */}
                {state.step === 1 && (
                    <Step1ShippingForm initialAddresses={initialAddresses} />
                )}
                {state.step === 2 && <Step2Payment />}
                {state.step === 3 && <Step3Confirmation />}
            </div>
        </main>
    )
}

// Outer component — provides context, receives server-side data
export default function CheckoutFlow({ isAuthenticated, initialAddresses, initialEmail }: Props) {
    return (
        <CheckoutProvider isGuest={!isAuthenticated} initialEmail={initialEmail}>
            <CheckoutContent initialAddresses={initialAddresses} />
        </CheckoutProvider>
    )
}
