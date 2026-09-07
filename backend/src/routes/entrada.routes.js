import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { crearEntrada } from "../services/entrada.service.js";
import { crearEntradaSchema } from "../validations/entrada.validation.js"
import { obtenerPorId, obtenerTodas } from "../controllers/entrada.controller.js"


const router = Router();

router.use(authMiddleware);

router.post("/", validate(crearEntradaSchema), crearEntrada);

router.get("/", obtenerTodas);

router.get("/:id",obtenerPorId);

export default router;