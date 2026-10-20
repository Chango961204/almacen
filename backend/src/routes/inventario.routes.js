import { Router } from "express";

import { inventarioAlmacen, inventarioProyecto, inventarioGeneral } from "../controllers/inventario.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/general", inventarioGeneral);
router.get("/almacen", inventarioAlmacen);
router.get("/proyecto/:proyectoId", inventarioProyecto);

export default router;
