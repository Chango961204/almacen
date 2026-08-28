import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";

import { crear, obtenerTodas, obtenerPorId, actualizar } from "../controllers/unidadMedida.controller.js"

import { crearUnidadMedidaSchema, actualizarUnidadMedidaSchema } from "../validations/unidadMedida.validation.js";


const router = Router();

router.use(authMiddleware);

router.get("/", obtenerTodas);

router.get("/:id", obtenerPorId);

router.post("/", validate(crearUnidadMedidaSchema), crear);

router.put("/:id", validate(actualizarUnidadMedidaSchema), actualizar)

export default router;