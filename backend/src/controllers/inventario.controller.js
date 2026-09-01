import * as inventarioService from "../services/inventario.service.js";

export const inventarioAlmacen = async (req, res, next) => {
    try {
        const inventario =
            await inventarioService.obtenerInventarioAlmacen();

        res.json({
            ok: true,
            data: inventario,
        });
    } catch (error) {
        next(error);
    }
};

export const inventarioProyecto = async (req, res, next) => {
    try {
        const proyectoId = Number(req.params.proyectoId);

        const inventario =
            await inventarioService.obtenerInventarioProyecto(
                proyectoId
            );

        res.json({
            ok: true,
            data: inventario,
        });
    } catch (error) {
        next(error);
    }
}
