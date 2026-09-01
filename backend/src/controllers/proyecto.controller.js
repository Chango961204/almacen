import * as proyectoService from "../services/proyecto.service.js";

export const crearProyecto = async (req, res, next) => {
    try {
        const proyecto = await proyectoService.crearProyecto(req.body);

        res.status(201).json({
            ok: true,
            message: "Proyecto creado correctamente",
            data: proyecto,
        });
    } catch (error) {
        next(error);
    }
};

export const listarProyectos = async (req, res, next) => {
    try {
        const proyectos = await proyectoService.obtenerProyectos();

        res.status(200).json({
            ok: true,
            message: "Lista de proyectos",
            data: proyectos,
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerProyectoPorId = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const proyecto = await proyectoService.obtenerProyecto(id);
        res.status(200).json({
            ok: true,
            message: "Proyecto encontrado",
            data: proyecto,
        });
    } catch (error) {
        next(error);
    }
};

export const actualizarProyecto = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const proyecto = await proyectoService.ActualizarProyecto(id, req.body);
        res.status(200).json({
            ok: true,
            message: "Proyecto actualizado ",
            data: proyecto,
        });
    } catch (error) {
        next(error);
    }
};

export const eliminarProyecto = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await proyectoService.eliminarProyecto(id);
        res.status(200).json({
            ok: true,
            message: "Proyecto eliminado ",
        });
    } catch (error) {
        next(error);
    }
};
