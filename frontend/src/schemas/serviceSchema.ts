import { z } from "zod";

export const serviceSchema = z.object({
  noDeServicio: z.string().nonempty("El número de servicio es obligatorio"),
  fecha: z.string().nonempty("La fecha es obligatoria"),
  aparato: z.string().nonempty("El aparato es obligatorio"),
  telefono: z
    .string()
    .nonempty("El teléfono es obligatorio")
    .regex(/^\d{10}$/, "El teléfono debe tener 10 dígitos"),
  cliente: z.string().nonempty("El cliente es obligatorio"),
  observaciones: z.string().optional(),
  estado: z.enum(["Pendiente", "En Proceso", "Reparado", "Entregado", "Cancelado", "Revision"]),
  marca: z.string().nonempty("La marca es obligatoria")
});

export const costNoteSchema = z.object({
  serviceNumber: z.number().min(1, "El número de servicio es requerido"),
  clientName: z.string().nonempty("El nombre del cliente es requerido"),
  deviceName: z.string().nonempty("El nombre del aparato es requerido"),
  laborCost: z.number().min(0, "El costo de mano de obra no puede ser negativo"),
  partsCost: z.number().min(0, "El costo de refacciones no puede ser negativo"),
  totalCost: z.number().min(0, "El costo total no puede ser negativo"),
  deliveryDate: z.string().nonempty("La fecha de entrega es requerida"),
  notes: z.string().optional(),
  paymentStatus: z.enum(["Pendiente", "Pagado", "Parcial"]).optional(),
  technician: z.string().optional(),
  warranty: z.number().min(0, "La garantía no puede ser negativa").optional(),
});