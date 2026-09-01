import  * as proyectoRepository from "../repositories/proyecto.repository.js";

export const crearProyecto = async (data) => {
    const proyectoExistente =
        await proyectoRepository.obtenerProyectos();

    const existe = proyectoExistente.some(
        (p) => p.nombre.toLowerCase() === data.nombre.toLowerCase()
    );

    if (existe) {
        const error = new Error("Ya existe un proyecto con ese nombre");
        error.statusCode = 400;
        throw error;
    }

    return proyectoRepository.crearProyecto({
        nombre: data.nombre,
        descripcion: data.descripcion || null,
        fechaInicio: data.fechaInicio
            ? new Date(data.fechaInicio)
            : null,
        fechaFin: data.fechaFin
            ? new Date(data.fechaFin)
            : null,
    });
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

export const ActualizarProyecto = async (id, data) => {
    await obtenerProyecto(id);

    return proyectoRepository.actualizarProyecto(id, {
        ...data,
        fechaInicio: data.fechaInicio
            ? new Date(data.fechaInicio)
            : null,
        fechaFin: data.fechaFin
            ? new Date(data.fechaFin)
            : null,
    });
};

export const eliminarProyecto = async (id) => {
    await obtenerProyecto(id);

    return proyectoRepository.eliminarProyecto(id);
};