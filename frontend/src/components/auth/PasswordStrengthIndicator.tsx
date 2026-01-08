'use client'

import { useMemo } from 'react'
import { calculatePasswordStrength } from '@/lib/validations/password'
import { Check, X } from 'lucide-react'

interface PasswordStrengthIndicatorProps {
    password: string
    showRequirements?: boolean
}

export default function PasswordStrengthIndicator({
    password,
    showRequirements = true,
}: PasswordStrengthIndicatorProps) {
    const { score, requirements, strength } = useMemo(
        () => calculatePasswordStrength(password),
        [password]
    )

    const strengthColors = {
        0: 'bg-gray-200',
        1: 'bg-red-500',
        2: 'bg-orange-500',
        3: 'bg-yellow-500',
        4: 'bg-green-500',
    }

    const strengthLabels = {
        'muy débil': 'Muy débil',
        'débil': 'Débil',
        'media': 'Media',
        'fuerte': 'Fuerte',
        'muy fuerte': 'Muy fuerte',
    }

    if (!password) return null

    return (
        <div className="space-y-2">
            {/* Barra de progreso */}
            <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Fortaleza de contraseña:</span>
                    <span
                        className={`font-medium ${
                            score >= 3 ? 'text-green-600' : score >= 2 ? 'text-yellow-600' : 'text-red-600'
                        }`}
                    >
                        {strengthLabels[strength]}
                    </span>
                </div>
                <div className="flex gap-1 h-2">
                    {[0, 1, 2, 3, 4].map((index) => (
                        <div
                            key={index}
                            className={`flex-1 rounded-full transition-all ${
                                index < score ? strengthColors[score as keyof typeof strengthColors] : 'bg-gray-200'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Requisitos */}
            {showRequirements && (
                <div className="space-y-1.5 text-sm">
                    <p className="text-gray-600 font-medium">Requisitos:</p>
                    <div className="space-y-1">
                        <RequirementItem
                            met={requirements.minLength}
                            label="Mínimo 8 caracteres"
                        />
                        <RequirementItem
                            met={requirements.hasUpperCase}
                            label="Al menos una letra mayúscula"
                        />
                        <RequirementItem
                            met={requirements.hasNumber}
                            label="Al menos un número"
                        />
                        <RequirementItem
                            met={requirements.hasSpecialChar}
                            label="Al menos un carácter especial (!@#$%^&*...)"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
    return (
        <div className={`flex items-center gap-2 ${met ? 'text-green-600' : 'text-gray-500'}`}>
            {met ? (
                <Check className="w-4 h-4" />
            ) : (
                <X className="w-4 h-4" />
            )}
            <span className={met ? 'line-through' : ''}>{label}</span>
        </div>
    )
}

