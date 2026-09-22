import * as marcaRepository from "../repositories/marca.repository.js";
import { registrar } from "./auditoria.service.js";

export const crear = async (data, usuarioId) => {
    const marcas = await marcaRepository.obtenerTodas();

    const existe = marcas.some(
        (marca) =>
            marca.nombre.toLocaleLowerCase() === data.nombre.toLocaleLowerCase()
    );

    if (existe) {
        const error = new Error("ya existe una marca con ese nombre");
        error.statusCode = 409;
        throw error;
    }

    const marca = await marcaRepository.crear({
        nombre: data.nombre,
    });

    await registrar({
        usuarioId,
        accion: "CREAR",
        entidad: "MARCA",
        entidadId: marca.id,
        descripcion: `Marca ${marca.nombre} registrada`,
    });

    return marca;
};

export const obtenerTodas = () => {
    return marcaRepository.obtenerTodas();
};

export const obtenerPorId = async (id) => {
    const marca = await marcaRepository.obtenerPorId(id);

    if (!marca) {
        const error = new Error("Marca no encontrada");
        error.statusCode = 404;
        throw error;
    }
    return marca;
};

export const actualizar = async (id, data, usuarioId) => {
    await obtenerPorId(id);

    const marca = await marcaRepository.actualizar(id, {
        nombre: data.nombre,
    });

    await registrar({
        usuarioId,
        accion: "ACTUALIZAR",
        entidad: "MARCA",
        entidadId: marca.id,
        descripcion: `Marca ${marca.nombre} actualizada`,
    });

    return marca;
};