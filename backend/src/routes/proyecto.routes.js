import { Router } from "express";
import { crearProyecto, listarProyectos, obtenerProyectoPorId, actualizarProyecto,eliminarProyecto } from "../controllers/proyecto.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);


router.get("/", listarProyectos);
router.get("/:id", obtenerProyectoPorId);
router.post("/", crearProyecto);
router.put("/:id", actualizarProyecto);
router.delete("/:id", eliminarProyecto);

export default router;
