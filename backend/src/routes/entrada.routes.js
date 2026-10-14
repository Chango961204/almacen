import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { crearEntradaSchema } from "../validations/entrada.validation.js"
import { crearEntrada, obtenerPorId, obtenerTodas } from "../controllers/entrada.controller.js"


const router = Router();

router.use(authMiddleware);
router.use(authorizeRoles("SUPER_ADMIN", "ADMIN"));

router.post("/", validate(crearEntradaSchema), crearEntrada);

router.get("/", obtenerTodas);

router.get("/:id",obtenerPorId);

export default router;
