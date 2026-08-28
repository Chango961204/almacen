import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { crearSalida } from "../controllers/salida.controller.js";
import { ieNoOpen } from "helmet";
import { detalleSalidaSchema } from "../validations/salida.validation.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(detalleSalidaSchema), crearSalida);

export default router;