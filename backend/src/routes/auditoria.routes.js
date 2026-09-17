import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { obtenerTodas } from "../controllers/auditoria.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(authorizeRoles("SUPER_ADMIN"));

router.get("/", obtenerTodas);

export default router;