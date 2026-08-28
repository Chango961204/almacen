import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { crearEntrada } from "../controllers/entrada.controller.js";
import { crearEntradaSchema } from "../validations/entrada.validation.js"


const router = Router();

router.use(authMiddleware);

router.post("/", validate(crearEntradaSchema), crearEntrada);

export default router;