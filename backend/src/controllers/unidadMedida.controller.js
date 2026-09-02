import * as unidadMedidaService from "../services/unidadMedida.service.js";

export const crear = async (req, res, next) => {
    try {
        const unidadMedida = await unidadMedidaService.crear(req.body);

        res.status(201).json({
            ok: true,
            message: "Unidad de medida creada",
            data: unidadMedida,
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerTodas = async (req, res, next) => {
    try {
        const unidadesMedida = await unidadMedidaService.obtenerTodas(req.body);


        res.json({
            ok: true,
            data: unidadesMedida,
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerPorId = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const unidadMedida = await unidadMedidaService.obtenerPorId(id);

        res.json({
            ok: true,
            data: unidadMedida,
        });
    } catch (error) {
        next(error);
    }
};

export const actualizar = async (req, res, next) => {
    try {
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
    } catch (error) {
        next(error);
    }
};
