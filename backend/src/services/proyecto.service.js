import * as proyectoRepository from "../repositories/proyecto.repository.js";
import { registrar } from "./auditoria.service.js";

const normalizarNombre = (nombre) =>
    String(nombre || "").trim().replace(/\s+/g, " ");

export const crearProyecto = async (data, usuarioId) => {
    const nombre = normalizarNombre(data.nombre);

    if (!nombre) {
        const error = new Error("El nombre del proyecto es obligatorio");
        error.statusCode = 400;
        throw error;
    }

    const proyectos = await proyectoRepository.obtenerProyectos();

    // Solo un proyecto ACTIVO bloquea el nombre. Los proyectos eliminados
    // (activo = false) conservan su nombre para el historial, pero permiten
    // crear uno nuevo con el mismo nombre.
    const existe = proyectos.some(
        (p) => p.activo && p.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (existe) {
        const error = new Error("Ya existe un proyecto activo con ese nombre");
        error.statusCode = 400;
        throw error;
    }

    const proyecto = await proyectoRepository.crearProyecto({
        nombre,
        descripcion: data.descripcion || null,
        fechaInicio: data.fechaInicio
            ? new Date(data.fechaInicio)
            : null,
        fechaFin: data.fechaFin
            ? new Date(data.fechaFin)
            : null,
    });

    await registrar({
        usuarioId,
        accion: "CREAR",
        entidad: "PROYECTO",
        entidadId: proyecto.id,
        descripcion: `Proyecto ${proyecto.nombre} creado`,
        datos: data,
    });

    return proyecto;
};

export const obtenerProyectos = async (data) => {
    return proyectoRepository.obtenerProyectos();
};

export const obtenerProyecto = async (id) => {
    const proyecto = await proyectoRepository.ObtenerProyectoPorId(id);

    if (!proyecto) {
        const error = new Error("Proyecto no encontrado");
        error.statusCode = 404;
        throw error;
    }
    return proyecto;
};

export const ActualizarProyecto = async (id, data, usuarioId) => {
    await obtenerProyecto(id);

    const nombre = normalizarNombre(data.nombre);

    if (!nombre) {
        const error = new Error("El nombre del proyecto es obligatorio");
        error.statusCode = 400;
        throw error;
    }

    const proyectos = await proyectoRepository.obtenerProyectos();

    const existe = proyectos.some(
        (p) =>
            p.activo &&
            p.id !== id &&
            p.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (existe) {
        const error = new Error("Ya existe un proyecto activo con ese nombre");
        error.statusCode = 400;
        throw error;
    }

    const proyecto = await proyectoRepository.actualizarProyecto(id, {
        ...data,
        nombre,
        fechaInicio: data.fechaInicio
            ? new Date(data.fechaInicio)
            : null,
        fechaFin: data.fechaFin
            ? new Date(data.fechaFin)
            : null,
    });

    await registrar({
        usuarioId,
        accion: "ACTUALIZAR",
        entidad: "PROYECTO",
        entidadId: proyecto.id,
        descripcion: `Proyecto ${proyecto.nombre} actualizado`,
        datos: data,
    });

    return proyecto;
};

export const eliminarProyecto = async (id, usuarioId) => {
    await obtenerProyecto(id);

    const proyecto = await proyectoRepository.eliminarProyecto(id);

    await registrar({
        usuarioId,
        accion: "ELIMINAR",
        entidad: "PROYECTO",
        entidadId: proyecto.id,
        descripcion: `Proyecto ${proyecto.nombre} marcado como inactivo`,
    });

    return proyecto;
};