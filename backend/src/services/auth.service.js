import bcrypt from "bcryptjs";
import { usuarioRepository } from "../repositories/usuario.repository.js";
import { generateAccessToken } from "../helpers/auth.helper.js";

export const authService = {
    async login(email, password) {
        const usuario = await usuarioRepository.findByEmail(email);

        if (!usuario) {
            throw new Error("CREDENCIALES_INVALIDAS");
        }

        if (!usuario.activo) {
            throw new Error("USUARIO_INACTIVO");
        }

        const passwordValida = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordValida) {
            throw new Error("CREDENCIALES_INVALIDAS");
        }

        const token = generateAccessToken({
            sub: usuario.id,
            rol: usuario.rol.nombre,
        });

        return {
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol.nombre,
            },
        };
    },

    async getCurrentUser(userId) {
        const usuario = await usuarioRepository.findById(userId);

        if (!usuario || !usuario.activo) {
            throw new Error("USUARIO_NO_ENCONTRADO");
        }

        return {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol.nombre,
        };
    },
};