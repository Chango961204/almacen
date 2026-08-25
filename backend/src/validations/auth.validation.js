import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("El correo electrónico no es válido"),

    password: z
        .string()
        .min(1, "La contraseña es obligatoria"),
});