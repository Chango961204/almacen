import { z } from "zod";

export const crearUnidadMedidaSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2)
        .max(50),

    simbolo: z
        .string()
        .trim()
        .min(1)
        .max(20),
});

export const actualizarUnidadMedidaSchema = crearUnidadMedidaSchema;