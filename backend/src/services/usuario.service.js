import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { usuarioRepository } from "../repositories/usuario.repository.js";

export const obtenerTodos = async () => {
    const usuarios = await usuarioRepository.findAll();

    return usuarios.map((usuario) => ({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        activo: usuario.activo,
        rol: usuario.rol.nombre,
        creadoEn: usuario.creadoEn,
    }));
};

export const crearUsuario = async (data, usuarioSesion) => {
    if (data.rol === "SUPER_ADMIN" && usuarioSesion.rol !== "SUPER_ADMIN") {
        const error = new Error("Solo el Super Administrador puede crear Super Administradores");
        error.statusCode = 403;
        throw error;
    }

    const emailExiste = await usuarioRepository.findByEmail(data.email);

    if (emailExiste) {
        const error = new Error("Ya existe un usuario con ese correo");
        error.statusCode = 409;
        throw error;
    }

    const rol = await prisma.rol.findUnique({
        where: {
            nombre: data.rol,
        },
    });

    if (!rol) {
        const error = new Error("El rol no es válido");
        error.statusCode = 400;
        throw error;
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const usuario = await usuarioRepository.create({
        nombre: data.nombre,
        email: data.email,
        password: passwordHash,
        rolId: rol.id,
    });

    await prisma.auditoria.create({
        data: {
            usuarioId: usuarioSesion.id,
            accion: "CREAR",
            entidad: "USUARIO",
            entidadId: usuario.id,
            descripcion: `Usuario ${usuario.email} registrado`,
        },
    });

    return {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        activo: usuario.activo,
        rol: usuario.rol.nombre,
    };
};