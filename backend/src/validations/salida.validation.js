import { z } from "zod";

export const detalleSalidaSchema = z.object({
    articuloId: z
        .coerce
        .number()
        .int()
        .positive(),
    cantidad: z
        .coerce
        .number()
        .positive(),
});

export const crearSalidaSchema = z.object({
    folio: z
        .string()
        .trim()
        .min(1)
        .max(50),

    proyectoId: z
        .coerce
        .number()
        .int()
        .positive(),

    fecha: z
        .string()
        .datetime(),

    responsable: z
        .string()
        .trim()
        .max(2000)
        .optional(),

    detalles: z
        .array(detalleSalidaSchema)
        .min(1),

});