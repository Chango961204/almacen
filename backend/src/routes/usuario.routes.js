import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { obtenerTodos, crearUsuario } from "../controllers/usuario.controller.js";
import { crearUsuarioSchema } from "../validations/usuario.validation.js";

const router = Router();

router.use(authMiddleware);

// El ADMIN puede ver la lista, pero solo el SUPER_ADMIN puede crear usuarios
router.get("/", authorizeRoles("SUPER_ADMIN", "ADMIN"), obtenerTodos);

router.post("/", authorizeRoles("SUPER_ADMIN"), validate(crearUsuarioSchema), crearUsuario);

export default router;
