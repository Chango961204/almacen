import { ZodError } from "zod";

export function errorMiddleware(error, req, res, next) {
    console.error(error);

    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Datos inválidos",
            errors: error.flatten().fieldErrors,
        });
    }

    if (error.message === "CREDENCIALES_INVALIDAS") {
        return res.status(401).json({
            success: false,
            message: "Correo o contraseña incorrectos",
        });
    }

    if (error.message === "USUARIO_INACTIVO") {
        return res.status(403).json({
            success: false,
            message: "El usuario está inactivo",
        });
    }

    if (error.message === "USUARIO_NO_ENCONTRADO") {
        return res.status(401).json({
            success: false,
            message: "Usuario no encontrado",
        });
    }

    return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
    });
}