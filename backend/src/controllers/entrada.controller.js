import * as entradaService from "../services/entrada.service.js";

export const crearEntrada = async (req, res) => {

    const entrada = await entradaService.crearEntrada(
        req.body,
        req.user.id
    );

    res.status(201).json({
        ok: true,
        message: "Entrada registrada correctamente",
        data: entrada,
    });
};

export const obtenerTodas = async (req, res) => {
    const entradas = await entradaService.obtenerTodas();
    res.json({
        ok: true,
        data: entradas,
    });
};

