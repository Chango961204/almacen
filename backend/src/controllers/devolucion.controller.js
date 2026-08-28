import * as devolucionService from "../services/devolucion.service.js";

export const crearDevolucion = async (req, res) => {

    const devolucion =
        await devolucionService.crearDevolucion(
            req.body,
            req.user.id
        );

    res.status(201).json({
        ok: true,
        message: "Devolución registrada correctamente",
        data: devolucion,
    });
};