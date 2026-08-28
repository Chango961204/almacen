import { z } from "zod";

export const crearMarcaSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, "El nombre de la marca debe de tener al menos 2 caracteres")
        .max(100)
});

export const actualizarMarcaSchema = crearMarcaSchema;
