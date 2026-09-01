import * as articuloRepository from "../repositories/articulo.repository.js";
import prisma from "../lib/prisma.js";


export const crearArticulo = async (data) => {
    const proyectoExistente =
        await articuloRepository.obtenerArticulos();

    const marca = await prisma.marca.findUnique({
        where: {
            id: data.marcaId
        },
    });

    if (!marca || !marca.activo) {
        const error = new Error("la marca no existe o no esta activa");
        error.statusCode = 400;
        throw error;
    }

    const unidad = await prisma.unidadMedida.findUnique({
        where: {
            id: data.unidadMedidaId
        },
    });

    if (!unidad || !unidad.activo) {
        const error = new Error("la unidad de medida no existe");
        error.statusCode = 400;
        throw error;
    }

    return articuloRepository.crearArticulo({
        codigo: data.codigo || null,
        nombre: data.nombre,
        especificaciones: data.especificaciones || null,
        marcaId: data.marcaId,
        unidadMedidaId: data.unidadMedidaId,
    });
};

export const listarArticulos = () => {
    return articuloRepository.obtenerArticulos();
};

export const obtenerArticulo = async (id) => {
    const articulo = await articuloRepository.obtenerArticuloPorId(id);
    if (!articulo) {
        const error = new Error("Articulo no encontrad");
        error.statusCode = 400;
        throw error;
    }

    return articulo;
};

export const actualizarArticulo = async (id, data) => {
    await obtenerArticulo(id);

    return articuloRepository.actualizarArticulo(id, data);
};

export const eliminarArticulo = async (id) => {
    await obtenerArticulo(id);

    return articuloRepository.eliminarArticulo(id);
};