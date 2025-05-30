import {z} from 'zod';
// Definición de esquemas para la validación de datos de usuario
// utilizando Zod, una biblioteca de validación de esquemas en TypeScript.
export type UserLogin = {
  email: string;
  contraseña: string;
};

export type UserSignup = {
  email: string;
  contraseña: string;
  confirmarContraseña: string;
  nombre: string;
  edad?: number;
};

export const SignupSchema = z.object({
  email: z.string().email(),
  contraseña: z.string().min(6).max(100),
  confirmarContraseña: z.string().min(6).max(100),
  nombre: z.string().min(2).max(100),
  edad: z.number().min(0).optional()

}).refine((data) => data.contraseña === data.confirmarContraseña, {
  message: 'Las contraseñas no coinciden',
});

export const LoginSchema = z.object({
  email: z.string().email(),
  contraseña: z.string().min(6).max(100),
});