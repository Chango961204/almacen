import * as articuloRepository from "../repositories/articulo.repository.js";
import prisma from "../lib/prisma.js";
import { registrar } from "./auditoria.service.js";

export const crearArticulo = async (data, usuarioId) => {
    const proyectoExistente =
        await articuloRepository.obtenerArticulos();

    const marca = await prisma.marca.findUnique({
        where: { id: data.marcaId },
    });

    if (!marca || !marca.activo) {
        const error = new Error("la marca no existe o no esta activa");
        error.statusCode = 400;
        throw error;
    }

    const unidad = await prisma.unidadMedida.findUnique({
        where: { id: data.unidadMedidaId },
    });

    if (!unidad || !unidad.activo) {
        const error = new Error("la unidad de medida no existe");
        error.statusCode = 400;
        throw error;
    }

    const articulo = await articuloRepository.crearArticulo({
        codigo: data.codigo || null,
        nombre: data.nombre,
        especificaciones: data.especificaciones || null,
        marcaId: data.marcaId,
        unidadMedidaId: data.unidadMedidaId,
    });

    await registrar({
        usuarioId,
        accion: "CREAR",
        entidad: "ARTICULO",
        entidadId: articulo.id,
        descripcion: `Artículo ${articulo.nombre} creado`,
        datos: data,
    });

    return articulo;
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

export const actualizarArticulo = async (id, data, usuarioId) => {
    await obtenerArticulo(id);

    const articulo = await articuloRepository.actualizarArticulo(id, data);

    await registrar({
        usuarioId,
        accion: "ACTUALIZAR",
        entidad: "ARTICULO",
        entidadId: articulo.id,
        descripcion: `Artículo ${articulo.nombre} actualizado`,
        datos: data,
    });

    return articulo;
};

export const eliminarArticulo = async (id, usuarioId) => {
    await obtenerArticulo(id);

    const articulo = await articuloRepository.eliminarArticulo(id);

    await registrar({
        usuarioId,
        accion: "ELIMINAR",
        entidad: "ARTICULO",
        entidadId: articulo.id,
        descripcion: `Artículo ${articulo.nombre} marcado como inactivo`,
    });

    return articulo;
};