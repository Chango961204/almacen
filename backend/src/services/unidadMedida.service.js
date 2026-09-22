import * as unidadMedidaRepository from "../repositories/unidadMedida.repository.js";
import { registrar } from "./auditoria.service.js";

export const crear = async (data, usuarioId) => {
    const unidad = await unidadMedidaRepository.crear({
        nombre: data.nombre,
        simbolo: data.simbolo,
    });

    await registrar({
        usuarioId,
        accion: "CREAR",
        entidad: "UNIDAD_MEDIDA",
        entidadId: unidad.id,
        descripcion: `Unidad de medida ${unidad.nombre} (${unidad.simbolo}) creada`,
    });

    return unidad;
};

export const obtenerTodas = () => {
    return unidadMedidaRepository.obtenerTodas();
};

export const obtenerPorId = async (id) => {
    const unidad = await unidadMedidaRepository.obtenerPorId(id);

    if (!unidad) {
        const error = new Error("unidad de medida no encotrada");
        error.statusCode = 404;
        throw error;
    }
    return unidad;
};

export const actualizar = async (id, data, usuarioId) => {
    await obtenerPorId(id);

    const unidad = await unidadMedidaRepository.actualizar(id, {
        nombre: data.nombre,
        simbolo: data.simbolo,
    });

    await registrar({
        usuarioId,
        accion: "ACTUALIZAR",
        entidad: "UNIDAD_MEDIDA",
        entidadId: unidad.id,
        descripcion: `Unidad de medida ${unidad.nombre} (${unidad.simbolo}) actualizada`,
    });

    return unidad;
};