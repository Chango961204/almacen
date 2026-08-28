import prisma from "../lib/prisma.js";

export const crear = (data) => {
    return prisma.unidadMedida.create({
        data,
    });
};

export const obtenerTodas = () => {
    return prisma.unidadMedida.findMany({
        orderBy: {
            nombre: "asc",
        },
    });
};

export const obtenerPorId = (id) => {
    return prisma.unidadMedida.findUnique({
        where: {
            id,
        },
    });
};

export const actualizar = (id, data) => {
    return prisma.unidadMedida.update({
        where: {
            id,
        },
        data,
    });
};

