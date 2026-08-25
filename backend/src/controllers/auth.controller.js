import { authService } from "../services/auth.service.js";
import { env } from "../config/env.js";
import { loginSchema } from "../validations/auth.validation.js";

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