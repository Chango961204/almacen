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
        const mensajesPorConstraint = {
            articulos_codigo_key: "el código",
            articulos_nombre_key: "el nombre",
            marcas_nombre_key: "el nombre de marca",
            unidades_medida_nombre_key: "el nombre de unidad de medida",
            unidades_medida_simbolo_key: "el símbolo de unidad de medida",
            proyectos_nombre_key: "el nombre de proyecto",
            usuarios_email_key: "el correo",
            roles_nombre_key: "el nombre de rol",
            salidas_folio_key: "el folio",
            devoluciones_folio_key: "el folio",
            entrada_detalles_entradaId_proyectoId_articuloId_key:
                "ese artículo en esta entrada para ese proyecto",
            salida_detalles_salidaId_articuloId_key:
                "ese artículo en esta salida",
            devolucion_detalles_devolucionId_salidaDetalleId_key:
                "ese artículo en esta devolución",
        };

        const constraint = Array.isArray(error.meta?.target)
            ? error.meta.target.join("_")
            : error.meta?.target;

        const mensaje = mensajesPorConstraint[constraint]
            ? `Ya existe un registro con ${mensajesPorConstraint[constraint]}.`
            : "Ya existe un registro con esos datos.";

        return res.status(409).json({
            success: false,
            message: mensaje,
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