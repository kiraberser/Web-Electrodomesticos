'use client'

import { memo } from 'react'
import { Check } from 'lucide-react'

// Hoisted — never re-creates on render (Vercel: rendering-hoist-jsx)
const STEPS = [
    { label: 'Envío' },
    { label: 'Pago' },
    { label: 'Confirmación' },
] as const

interface Props {
    currentStep: 1 | 2 | 3
}

// memo() — only re-renders when currentStep changes (Vercel: rerender-memo)
const CheckoutStepIndicator = memo(function CheckoutStepIndicator({ currentStep }: Props) {
    return (
        <nav aria-label="Pasos del proceso de compra" className="mb-8">
            <ol className="flex items-center justify-center gap-0">
                {STEPS.map((step, index) => {
                    const stepNumber = (index + 1) as 1 | 2 | 3
                    const isCompleted = stepNumber < currentStep
                    const isActive = stepNumber === currentStep

                    return (
                        <li key={step.label} className="flex items-center">
                            {/* Circle */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`
                                        flex h-9 w-9 items-center justify-center rounded-full border-2 font-semibold text-sm transition-all
                                        ${isCompleted ? 'border-green-500 bg-green-500 text-white' : ''}
                                        ${isActive ? 'border-[#0A3981] bg-[#0A3981] text-white shadow-lg shadow-blue-200' : ''}
                                        ${!isCompleted && !isActive ? 'border-gray-200 bg-white text-gray-400' : ''}
                                    `}
                                >
                                    {isCompleted ? (
                                        <Check className="h-4 w-4 stroke-[3]" />
                                    ) : (
                                        <span>{stepNumber}</span>
                                    )}
                                </div>
                                <span
                                    className={`mt-1.5 text-xs font-medium hidden sm:block ${
                                        isActive ? 'text-[#0A3981]' : isCompleted ? 'text-green-600' : 'text-gray-400'
                                    }`}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {/* Connector line (not after last step) */}
                            {index < STEPS.length - 1 && (
                                <div
                                    className={`h-0.5 w-16 sm:w-24 mx-2 transition-colors ${
                                        stepNumber < currentStep ? 'bg-green-500' : 'bg-gray-200'
                                    }`}
                                />
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
})

export default CheckoutStepIndicator
