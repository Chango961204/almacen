import * as entradaService from "../services/entrada.service.js";

export const crearEntrada = async (req, res, next) => {
    try {
        const entrada = await entradaService.crearEntrada(
            req.body,
            req.user.id
        );

        res.status(201).json({
            ok: true,
            message: "Entrada registrada correctamente",
            data: entrada,
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerTodas = async (req, res, next) => {
    try {
        const entradas = await entradaService.obtenerTodas();
        res.json({
            ok: true,
            data: entradas,
        });
    } catch (error) {
        next(error);
    }
};


export const obtenerPorId = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const entrada = await entradaService.obtenerPorId(id);

        res.json({
            ok: true,
            data: entrada,
        });
    } catch (error) {
        next(error);
    }

};



