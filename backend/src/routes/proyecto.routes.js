import { Router } from "express";
import { crearProyecto, listarProyectos, obtenerProyectoPorId, actualizarProyecto,eliminarProyecto } from "../controllers/proyecto.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.use(authMiddleware);


// La lectura la necesitan todos los roles (p. ej. Inventario y el Inicio)
router.get("/", listarProyectos);
router.get("/:id", obtenerProyectoPorId);

// La escritura queda solo para administradores
router.post("/", authorizeRoles("SUPER_ADMIN", "ADMIN"), crearProyecto);
router.put("/:id", authorizeRoles("SUPER_ADMIN", "ADMIN"), actualizarProyecto);
router.delete("/:id", authorizeRoles("SUPER_ADMIN"), eliminarProyecto);

export default router;
