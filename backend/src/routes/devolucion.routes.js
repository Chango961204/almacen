import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { crearDevolucion } from "../controllers/devolucion.controller.js";
import { crearDevolucionSchema } from "../validations/devolucion.validation.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(crearDevolucionSchema), crearDevolucion);

export default router;