'use client'

import { useRef, useTransition, useCallback } from 'react'
import { useCart } from '@/features/cart/CartContext'
import { checkAuthentication } from '@/shared/lib/cookies'
import { useCheckoutContext } from '@/features/checkout/CheckoutProvider'
import type { ShippingData } from '@/features/checkout/CheckoutProvider'

export function useCheckoutFlow() {
    const { state, setStep, setShippingData, setPaymentResult } = useCheckoutContext()
    const { clearCart } = useCart()

    // Prevents double-submit while async actions are in flight (Vercel: rerender-use-ref-transient-values)
    const isSubmittingRef = useRef(false)
    const [isPending, startTransition] = useTransition()

    // Stable ref to clearCart — avoids stale closure in payment handler (Vercel: advanced-use-latest)
    const clearCartRef = useRef(clearCart)
    clearCartRef.current = clearCart

    const goToStep = useCallback(
        (step: 1 | 2 | 3) => {
            startTransition(() => setStep(step))
        },
        [setStep],
    )

    /**
     * Step 1 submit: saves shipping data locally and advances to Step 2.
     * Order creation is deferred to payment time (atomic with payment).
     */
    const submitShipping = useCallback(
        async (data: ShippingData): Promise<string | null> => {
            if (isSubmittingRef.current) return null
            isSubmittingRef.current = true
            try {
                setShippingData(data)
                startTransition(() => setStep(2))
                return null
            } finally {
                isSubmittingRef.current = false
            }
        },
        [setShippingData, setStep],
    )

    /**
     * Called by Step2Payment when payment resolves.
     * Clears cart on success and advances to Step 3.
     */
    const handlePaymentResult = useCallback(
        (result: {
            status: 'approved' | 'rejected' | 'pending'
            method: 'card' | 'cash'
            pedidoId?: number
            total?: string
            voucherUrl?: string
            expiresAt?: string
        }) => {
            setPaymentResult(result)

            if (result.status === 'approved' || result.method === 'cash') {
                clearCartRef.current()
            }

            if (result.status !== 'rejected') {
                startTransition(() => setStep(3))
            }
        },
        [setPaymentResult, setStep],
    )

    const isAuthenticated = checkAuthentication()

    return {
        state,
        goToStep,
        submitShipping,
        handlePaymentResult,
        isSubmitting: isSubmittingRef.current || isPending,
        isAuthenticated,
    }
}
