import * as marcaService from "../services/marca.service.js";

export const crear = async (req, res) => {
    const marca = await marcaService.crear(req.body);

    res.status(201).json({
        ok: true,
        message: "Marca Creada",
        data: marca,
    });
};

export const obtenerTodas = async (req, res) => {
    const marcas = await marcaService.obtennerTodas(req.body);

    res.json({
        ok: true,
        data: marcas,
    });
};

export const obtenerPorId = async (req, res) => {
    const id = Number(req.params.id);

    const marca = await marcaService.obtenerPorId(id);

    res.json({
        ok: true,
        data: marca,
    });
};

export const actualizar = async (req, res) => {
    const id = Number(req.params.id);
    const marca = await marcaService.actualizar(
        id,
        req.body
    );
    res.json({
        ok: true,
        message: "Marca Actualizada",
        data: marca,
    });
};
