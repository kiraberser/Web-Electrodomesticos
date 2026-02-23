import { z } from 'zod';

/**
 * Schema para validación de creación de dirección
 */
export const createDireccionSchema = z.object({
    nombre: z
        .string()
        .min(1, 'El nombre de la dirección es requerido')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .trim(),
    street: z
        .string()
        .min(1, 'La calle y número son requeridos')
        .max(255, 'La calle no puede exceder 255 caracteres')
        .trim(),
    colony: z
        .string()
        .min(1, 'La colonia es requerida')
        .max(255, 'La colonia no puede exceder 255 caracteres')
        .trim(),
    city: z
        .string()
        .min(1, 'La ciudad es requerida')
        .max(100, 'La ciudad no puede exceder 100 caracteres')
        .trim(),
    state: z
        .string()
        .min(1, 'El estado es requerido')
        .max(100, 'El estado no puede exceder 100 caracteres')
        .trim(),
    postal_code: z
        .string()
        .min(1, 'El código postal es requerido')
        .regex(/^\d{5}$/, 'El código postal debe tener exactamente 5 dígitos')
        .transform((val) => val.replace(/\s|-/g, '')),
    references: z.string().optional().nullable(),
    is_primary: z.boolean().default(false),
});

/**
 * Schema base para validación de información extra de dirección (sin refine)
 */
const direccionExtraInfoSchemaBase = z.object({
    tipo_lugar: z.enum(['casa', 'edificio', 'abarrotes', 'otro']).optional().nullable(),
    barrio_privado: z.boolean().default(false),
    conserjeria: z.boolean().default(false),
    nombre_lugar: z.string().max(255, 'El nombre del lugar no puede exceder 255 caracteres').optional().nullable(),
    horario_apertura: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)').optional().nullable(),
    horario_cierre: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)').optional().nullable(),
    horario_24hs: z.boolean().default(false),
    horarios_adicionales: z
        .record(
            z.string(),
            z.object({
                apertura: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
                cierre: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
            })
        )
        .optional()
        .nullable(),
});

/**
 * Schema para validación de información extra de dirección (con refine para validación completa)
 */
export const direccionExtraInfoSchema = direccionExtraInfoSchemaBase.refine(
    (data) => {
        // Si horario_24hs es false, entonces horario_apertura y horario_cierre deben estar presentes
        if (!data.horario_24hs) {
            return data.horario_apertura !== null && data.horario_apertura !== undefined && 
                   data.horario_cierre !== null && data.horario_cierre !== undefined;
        }
        return true;
    },
    {
        message: 'Los horarios de apertura y cierre son requeridos cuando no es 24 horas',
        path: ['horario_apertura'],
    }
);

/**
 * Schema combinado para actualizar dirección completa (incluyendo info extra)
 */
export const updateDireccionSchema = createDireccionSchema.partial().merge(direccionExtraInfoSchemaBase.partial());

/**
 * Tipos TypeScript derivados de los schemas
 */
export type CreateDireccionInput = z.infer<typeof createDireccionSchema>;
export type DireccionExtraInfoInput = z.infer<typeof direccionExtraInfoSchema>;
export type UpdateDireccionInput = z.infer<typeof updateDireccionSchema>;
