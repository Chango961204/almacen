import { z } from "zod";

export const crearArticuloSchema = z.object({
    codigo: z
        .string()
        .trim()
        .max(50)
        .optional(),

    nombre: z
        .string()
        .trim()
        .min(2)
        .max(50)
        .optional(),

    especificaciones: z
        .string()
        .trim()
        .max(2000)
        .optional(),

    marcaId: z.coerce
        .number()
        .int()
        .positive(),

    unidadMedidaId: z.coerce
        .number()
        .int()
        .positive(),
});

export const actualizarArticuloSchema = crearArticuloSchema.partial();