import * as articuloService from "../services/articulo.service.js";

export const crearArticulo = async (req, res) => {
    const articulo = await articuloService.crearArticulo(req.body);

    res.status(201).json({
        ok: true,
        message: "Articulo creado correctamente",
        data: articulo
    });
};

export const listarArticulos = async (req, res) => {
    const articulos = await articuloService.listarArticulos();

    res.status(200).json({
        ok: true,
        message: "Lista de articulos",
        data: articulos,
    });
};

export const obtenerArticulo = async (req, res) => {
    const id = Number(req.params.id);
    const articulo = await articuloService.obtenerArticulo(id);

    res.status(200).json({
        ok: true,
        message: "Articulo encontrado",
        data: articulos,
    });
}

export const actualizarArticulo = async (req, res) => {
    const id = Number(req.params.id);
    const articulo = await articuloService.actualizarArticulo(id, req.body);

    res.status(200).json({
        ok: true,
        message: "Articulo actualizado ",
        data: articulos,
    });
}

export const eliminarArticulo = async (req, res) => {
    const id = Number(req.params.id);
    const articulo = await articuloService.eliminarArticulo(id);

    res.status(200).json({
        ok: true,
        message: "Articulo eliminado",
        data: articulos,
    });
}

