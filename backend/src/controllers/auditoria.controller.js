import * as auditoriaService from "../services/auditoria.service.js";

export const obtenerTodas = async (req, res, next) => {
    try {
        const auditorias = await auditoriaService.obtenerTodas(req.query);

        res.json({
            ok: true,
            data: auditorias
        })

    } catch (error) {
        next(error);
    }
};
