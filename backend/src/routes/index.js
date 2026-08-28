import { Router } from "express";

import authRoutes from "./auth.routes.js";
import healthRoutes from "./health.routes.js";
import proyectoRoutes from "./proyecto.routes.js";
import articuloRoutes from "./articulo.routes.js";
import entradaRoutes from "./entrada.routes.js";
import salidaRoutes from "./salida.routes.js";
import devolucionRoutes from "./devolucion.routes.js";
import inventarioRoutes from "./inventario.routes.js";
import marcaRoutes from "./marca.routes.js";
import unidadMedidaRoutes from "./unidadMedida.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/health", healthRoutes);

router.use("/proyectos", proyectoRoutes);
router.use("/articulos", articuloRoutes);

router.use("/entradas", entradaRoutes);
router.use("/salidas", salidaRoutes);
router.use("/devoluciones", devolucionRoutes);

router.use("/inventario", inventarioRoutes);
router.use("/marcas", marcaRoutes);
router.use("unidadMedida", unidadMedidaRoutes);

export default router;