import * as proyectoService from "../services/proyecto.service.js";

export const crearProyecto = async (req, res) => {
    const proyecto = await proyectoService.crearProyecto(req.body);

    res.status(201).json({
        ok: true,
        message: "Proyecto creado correctamente",
        data: proyecto,
    });
};

export const listarProyectos = async (req, res) => {
    const proyectos = await proyectoService.obtenerProyectos();

    res.status(200).json({
        ok: true,
        message: "Lista de proyectos",
        data: proyectos,
    });
};

export const obtenerProyecto = async(req, res)=>{
    const id = Number(req.params.id);
    const proyecto = await proyectoService.obtenerProyecto(id);
    res.status(200).json({
        ok: true,
        message: "Proyecto encontrado",
        data: proyecto,
    });
};

export const actualizarProyecto = async (req,res)=>{
    const id = Number(req.params.id);
    const proyecto = await proyectoService.ActualizarPrroyecto(id, req.body);
    res.status(200).json({
        ok: true,
        message: "Proyecto actualizado ",
        data: proyecto,
    });
};

export const eliminarProyecto = async (req,res)=>{
    const id = Number(req.params.id);
    await proyectoService.obtenerProyecto(id);
    await proyectoService.eliminarProyecto(id);
    res.status(200).json({
        ok: true,
        message: "Proyecto eliminado ",
    });
};

