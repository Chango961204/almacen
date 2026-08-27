import { Router } from "express";
import { listarArticulos, obtenerArticulo, crearArticulo, actualizarArticulo, eliminarArticulo } from "../controllers/articulo.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.usee(authMiddleware);

router.get("/", listarArticulos);
router.get("/:id", obtenerArticulo);
router.post("/", crearArticulo);
router.put("/:id", actualizarArticulo);
router.delete("/:id", eliminarArticulo);

export default router;
