import * as unidadMedidaService from "../services/unidadMedida.service.js";

export const crear = async (req, res) => {
    const unidadMedida = await unidadMedidaService.crear(req.body);

    res.status(201).json({
        ok: true,
        message: "Unidad de medida creada",
        data: marca,
    });
};

export const obtenerTodas = async (req, res) => {
    const unidadesMedida = await unidadMedidaService.obtenerTodas(req.body);

    res.json({
        ok: true,
        data: unidadesMedida,
    });
};

export const obtenerPorId = async (req, res) => {
    const id = Number(req.params.id);

    const unidadMedida = await unidadMedidaService.obtenerPorId(id);

    res.json({
        ok: true,
        data: unidadMedida,
    });
};

export const actualizar = async (req, res) => {
    const id = Number(req.params.id);
    const unidadMedida = await unidadMedidaService.actualizar(
        id,
        req.body
    );
    res.json({
        ok: true,
        message: "Unidad de medida actualizada",
        data: unidadMedida,

    });
};
