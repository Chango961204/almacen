import * as usuarioService from "../services/usuario.service.js";

export const obtenerTodos = async (req, res, next) => {
    try {
        const usuarios = await usuarioService.obtenerTodos();

        res.json({
            ok: true,
            data: usuarios,
        });
    } catch (error) {
        next(error);
    }
};

export const crearUsuario = async (req, res, next) => {
    try {
        const usuario = await usuarioService.crearUsuario(req.body, req.user);

        res.status(201).json({
            ok: true,
            message: "Usuario creado correctamente",
            data: usuario,
        });
    } catch (error) {
        next(error);
    }
};