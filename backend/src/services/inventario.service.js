import prisma from "../lib/prisma.js";

const incluirArticulo = {
    articulo: {
        include: {
            marca: true,
            unidadMedida: true,
        },
    },
};

const ordenarPorArticulo = {
    articulo: {
        nombre: "asc",
    },
};

// Filtro compartido: solo existencias positivas de artículos activos.
const soloExistenciasActivas = {
    cantidadActual: {
        gt: 0,
    },
    articulo: {
        activo: true,
    },
};

export const obtenerInventarioAlmacen = async () => {
    return prisma.inventarioAlmacen.findMany({
        where: {
            ...soloExistenciasActivas,
        },
        include: incluirArticulo,
        orderBy: ordenarPorArticulo,
    });
};

export const obtenerInventarioProyecto = async (proyectoId) => {

    const proyecto = await prisma.proyecto.findUnique({
        where: {
            id: proyectoId,
        },
    });

    if (!proyecto) {
        const error = new Error("Proyecto no encontrado");
        error.statusCode = 404;
        throw error;
    }

    return prisma.inventarioProyecto.findMany({
        where: {
            proyectoId,
            ...soloExistenciasActivas,
        },
        include: incluirArticulo,
        orderBy: ordenarPorArticulo,
    });
};

// Inventario completo para el reporte PDF:
// - almacen: existencias del almacén general.
// - proyectos: solo proyectos que tengan existencia, incluyendo los
//   inactivos (con su bandera activo para marcarlos en el PDF).
export const obtenerInventarioGeneral = async () => {
    const [almacen, proyectos] = await Promise.all([
        obtenerInventarioAlmacen(),
        prisma.proyecto.findMany({
            orderBy: {
                nombre: "asc",
            },
            include: {
                inventarios: {
                    where: {
                        ...soloExistenciasActivas,
                    },
                    include: incluirArticulo,
                    orderBy: ordenarPorArticulo,
                },
            },
        }),
    ]);

    return {
        almacen,
        proyectos: proyectos
            .filter((proyecto) => proyecto.inventarios.length > 0)
            .map((proyecto) => ({
                id: proyecto.id,
                nombre: proyecto.nombre,
                activo: proyecto.activo,
                inventarios: proyecto.inventarios,
            })),
    };
};
