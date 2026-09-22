import * as marcaService from "../services/marca.service.js";

export const crear = async (req, res, next) => {
    try {
        const marca = await marcaService.crear(req.body, req.user.id);

        res.status(201).json({
            ok: true,
            message: "Marca Creada",
            data: marca,
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerTodas = async (req, res, next) => {
    try {
        const marcas = await marcaService.obtenerTodas(req.body);


        res.json({
            ok: true,
            data: marcas,
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerPorId = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        const marca = await marcaService.obtenerPorId(id);

        res.json({
            ok: true,
            data: marca,
        });
    } catch (error) {
        next(error);
    }
};

export const actualizar = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const marca = await marcaService.actualizar(id, req.body, req.user.id);
        res.json({
            ok: true,
            message: "Marca Actualizada",
            data: marca,
        });
    } catch (error) {
        next(error);
    }
};
