import { env } from "../config/env.js";
import { verifyAccessToken } from "../helpers/auth.helper.js";

export function authMiddleware(req, res, next) {
  try {
    const token = req.cookies[env.COOKIE_NAME];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No autenticado",
      });
    }

    const payload = verifyAccessToken(token);

    req.user = {
      id: Number(payload.sub),
      rol: payload.rol,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Sesión inválida o expirada",
    });
  }
}