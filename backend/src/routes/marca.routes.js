import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";

import { crear, obtenerTodas, obtenerPorId, actualizar } from "../controllers/marca.controller.js";

import { crearMarcaSchema, actualizarMarcaSchema } from "../validations/marca.validation.js";



const router = Router();

router.use(authMiddleware);

router.get("/", obtenerTodas);

router.get("/:id", obtenerPorId);

router.post("/", validate(crearMarcaSchema), crear);

router.put("/:id", validate(actualizarMarcaSchema), actualizar)

export default router;
