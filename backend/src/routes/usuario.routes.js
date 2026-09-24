import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { obtenerTodos, crearUsuario } from "../controllers/usuario.controller.js";
import { crearUsuarioSchema } from "../validations/usuario.validation.js";

const router = Router();

router.use(authMiddleware);
router.use(authorizeRoles("SUPER_ADMIN",));

router.get("/", obtenerTodos);

router.post("/", validate(crearUsuarioSchema), crearUsuario);

export default router;