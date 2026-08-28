import { z } from "zod";

const detalleDevolucionSchema = z.object({
    salidaDetalleId: z.coerce.number().int().positive(),
    cantidad: z.coerce.number().positive(),
});

export const crearDevolucionSchema = z.object({
    folio: z.string().trim().min(1).max(50),

    salidaId: z.coerce.number().int().positive(),

    fecha: z.string().datetime(),

    motivo: z
        .string()
        .trim()
        .min(3)
        .max(2000),

    detalles: z
        .array(detalleDevolucionSchema)
        .min(1),
});