import { z } from "zod";

export const crearUsuarioSchema = z.object({
    nombre: z.string().trim().min(2).max(100),
    email: z.string().trim().email("El correo electrónico no es válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    rol: z.enum(["SUPER_ADMIN", "ADMIN", "USUARIO"]),
});

