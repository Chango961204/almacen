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

    if (error.statusCode) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }

    if (error.code === "P2002") {
        return res.status(409).json({
            success: false,
            message: "Ya existe un registro con esos datos",
        });
    }

    if (error.code === "P2025") {
        return res.status(404).json({
            success: false,
            message: "Registro no encontrado",
        });
    }

    return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
    });
}