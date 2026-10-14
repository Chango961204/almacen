import { Router } from "express";
import { listarArticulos, obtenerArticulo, crearArticulo, actualizarArticulo, eliminarArticulo } from "../controllers/articulo.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(authorizeRoles("SUPER_ADMIN", "ADMIN"));

router.get("/", listarArticulos);
router.get("/:id", obtenerArticulo);
router.post("/", crearArticulo);
router.put("/:id", actualizarArticulo);
router.delete("/:id", authorizeRoles("SUPER_ADMIN"), eliminarArticulo);

export default router;
