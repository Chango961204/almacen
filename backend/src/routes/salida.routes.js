import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { crearSalida } from "../controllers/salida.controller.js";
import { crearSalidaSchema } from "../validations/salida.validation.js";


const router = Router();

router.use(authMiddleware);

router.post("/", validate(crearSalidaSchema), crearSalida);
export default router;