import * as articuloService from "../services/articulo.service.js";

export const crearArticulo = async (req, res, next) => {
    try {
        const articulo = await articuloService.crearArticulo(req.body);

        res.status(201).json({
            ok: true,
            message: "Articulo creado correctamente",
            data: articulo
        });
    } catch (error) {
        next(error);
    }
};

export const listarArticulos = async (req, res, next) => {
    try {
        const articulos = await articuloService.listarArticulos();
        res.json({
            ok: true,
            data: articulos,
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerArticulo = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const articulo = await articuloService.obtenerArticulo(id);
        res.json({
            ok: true,
            data: articulo,
        });
    } catch (error) {
        next(error);
    }
};

export const actualizarArticulo = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const articulo = await articuloService.actualizarArticulo(id, req.body);
        res.json({
            ok: true,
            message: "Articulo actualizado correctamente",
            data: articulo,
        });
    } catch (error) {
        next(error);
    }
};

export const eliminarArticulo = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const articulo = await articuloService.eliminarArticulo(id);
        res.json({
            ok: true,
            message: "Articulo eliminado correctamente",
            data: articulo,
        });
    } catch (error) {
        next(error);
    }
}
