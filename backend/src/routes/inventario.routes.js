import { Router } from "express";

import { inventarioAlmacen, inventarioProyecto, } from "../controllers/inventario.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/almacen", inventarioAlmacen);
router.get("/proyecto/:proyectoId", inventarioProyecto);

export default router;