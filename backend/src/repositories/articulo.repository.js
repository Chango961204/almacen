import prisma from '../lib/prisma.js';

export const crearArticulo = async (data) => {
    return prisma.articulo.create({
        data,
    });
}

export const obtenerArticulos = () => {
    return prisma.articulo.findMany({
        orderBy: {
            nombre: "asc",
        },
    });
};

export const obtenerArticuloPorId = (id) => {
    return prisma.articulo.findUnique({
        where: {
            id,
        },
    });
};

export const actualizarArticulo = (id, data) => {
    return prisma.articulo.update({
        where: {
            id,
        },
        data,
    });
};
