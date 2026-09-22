import { authService } from "../services/auth.service.js";
import { env } from "../config/env.js";
import { loginSchema } from "../validations/auth.validation.js";
import { registrar } from "../services/auditoria.service.js";
import { verifyAccessToken } from "../helpers/auth.helper.js";

const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
};

export const authController = {
    async login(req, res, next) {
        try {
            const result = loginSchema.parse(req.body);

            const auth = await authService.login(
                result.email,
                result.password
            );

            res.cookie(
                env.COOKIE_NAME,
                auth.token,
                cookieOptions
            );

            await registrar({
                usuarioId: auth.usuario.id,
                accion: "LOGIN",
                entidad: "SESION",
                entidadId: auth.usuario.id,
                descripcion: `Inicio de sesión de ${auth.usuario.email}`,
            });

            return res.status(200).json({
                success: true,
                message: "Inicio de sesión correcto",
                usuario: auth.usuario,
            });
        } catch (error) {
            next(error);
        }
    },

    async me(req, res, next) {
        try {
            const usuario = await authService.getCurrentUser(
                req.user.id
            );

            return res.status(200).json({
                success: true,
                usuario,
            });
        } catch (error) {
            next(error);
        }
    },

    async logout(req, res, next) {
        try {
            const token = req.cookies[env.COOKIE_NAME];

            if (token) {
                try {
                    const payload = verifyAccessToken(token);

                    await registrar({
                        usuarioId: Number(payload.sub),
                        accion: "LOGOUT",
                        entidad: "SESION",
                        entidadId: Number(payload.sub),
                        descripcion: "Cierre de sesión",
                    });
                } catch {
                    // cookie inválida o expirada: solo se limpia
                }
            }

            res.clearCookie(
                env.COOKIE_NAME,
                cookieOptions
            );

            return res.status(200).json({
                success: true,
                message: "Sesión cerrada correctamente",
            });
        } catch (error) {
            next(error);
        }
    },
};