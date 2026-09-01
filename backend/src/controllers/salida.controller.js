import * as salidaService from "../services/salida.service.js";

export const crearSalida = async (req, res, next) => {
    try {
        const salida = await salidaService.crearSalida(req.body, req.user.id);
        res.status(201).json({
            ok: true,
            message: "Salida registrada correctamente",
            data: salida,
        });
    } catch (error) {
        next(error);
    }
};
