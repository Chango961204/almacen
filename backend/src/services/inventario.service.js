import prisma from "../lib/prisma.js";

export const obtenerInventarioAlmacen = async () => {
    return prisma.inventarioAlmacen.findMany({
        where: {
            cantidadActual: {
                gt: 0,
            },
        },
        include: {
            articulo: {
                include: {
                    marca: true,
                    unidadMedida: true,
                },
            },
        },
        orderBy: {
            articulo: {
                nombre: "asc",
            },
        },
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
            cantidadActual: {
                gt: 0,
            },
        },
        include: {
            articulo: {
                include: {
                    marca: true,
                    unidadMedida: true,
                },
            },
        },
        orderBy: {
            articulo: {
                nombre: "asc",
            },
        },
    });
};