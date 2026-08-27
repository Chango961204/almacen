import { z } from "zod";

export const crearProyectoSchema = z.object({
    nombre: z
    .string()
    .trim()
    .min(3, "el nombre debe tener al menos 3 caracteres")
    .max(100),

    descripcion: z
    .string()
    .trim()
    .max(10000)
    .optional()
    .or(z.literal("")),

    fechaInicio: z
    .string()
    .datetime()
    .optional(),

    fechaFin: z
    .string()
    .datetime()
    .optional(),

});

export const actualizarProyectoSchema = crearProyectoSchema.partial();