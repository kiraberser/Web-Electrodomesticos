import { z } from 'zod';

/**
 * Schema para validación de solicitud de recuperación de contraseña
 */
export const passwordResetRequestSchema = z.object({
    email: z
        .string()
        .min(1, 'El correo electrónico es requerido')
        .email('Por favor ingresa un correo electrónico válido')
        .toLowerCase()
        .trim(),
});

/**
 * Schema para validación de contraseña con indicador de fortaleza
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Al menos una letra mayúscula
 * - Al menos un número
 * - Al menos un carácter especial
 */
export const passwordSchema = z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
    .regex(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/, 'La contraseña debe contener al menos un carácter especial (!@#$%^&*...)');

/**
 * Schema para validación de confirmación de recuperación de contraseña
 */
export const passwordResetConfirmSchema = z
    .object({
        token: z.string().min(1, 'Token requerido'),
        uid: z.string().min(1, 'UID requerido'),
        password: passwordSchema,
        password_confirm: z.string().min(1, 'Confirma tu contraseña'),
    })
    .refine((data) => data.password === data.password_confirm, {
        message: 'Las contraseñas no coinciden',
        path: ['password_confirm'],
    });

/**
 * Tipo TypeScript derivado del schema de solicitud
 */
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;

/**
 * Tipo TypeScript derivado del schema de confirmación
 */
export type PasswordResetConfirmInput = z.infer<typeof passwordResetConfirmSchema>;

/**
 * Schema para cambiar contraseña desde el perfil (requiere contraseña actual)
 */
export const changePasswordSchema = z
    .object({
        current_password: z.string().min(1, 'La contraseña actual es requerida'),
        new_password: passwordSchema,
        new_password_confirm: z.string().min(1, 'Confirma tu nueva contraseña'),
    })
    .refine((data) => data.new_password === data.new_password_confirm, {
        message: 'Las contraseñas no coinciden',
        path: ['new_password_confirm'],
    });

/**
 * Tipo TypeScript derivado del schema de cambio de contraseña
 */
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

/**
 * Función para calcular la fortaleza de una contraseña
 * Retorna un objeto con el score (0-4) y los requisitos cumplidos
 */
export function calculatePasswordStrength(password: string): {
    score: number;
    requirements: {
        minLength: boolean;
        hasUpperCase: boolean;
        hasNumber: boolean;
        hasSpecialChar: boolean;
    };
    strength: 'muy débil' | 'débil' | 'media' | 'fuerte' | 'muy fuerte';
} {
    const requirements = {
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
    };

    let score = 0;
    if (requirements.minLength) score++;
    if (requirements.hasUpperCase) score++;
    if (requirements.hasNumber) score++;
    if (requirements.hasSpecialChar) score++;

    let strength: 'muy débil' | 'débil' | 'media' | 'fuerte' | 'muy fuerte' = 'muy débil';
    if (score === 1) strength = 'débil';
    else if (score === 2) strength = 'media';
    else if (score === 3) strength = 'fuerte';
    else if (score === 4) strength = 'muy fuerte';

    return { score, requirements, strength };
}

