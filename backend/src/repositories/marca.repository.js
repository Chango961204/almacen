import prisma from "../lib/prisma.js";

export const crear = (data) => {
    return prisma.marca.create({
        data,
    });
};

export const obtenerTodas = () => {
    return prisma.marca.findMany({
        orderBy: {
            nombre: "asc",
        },
    });
};

export const obtenerPorId = (id) => {
    return prisma.marca.findUnique({
        where: {
            id,
        },
    });
};

export const actualizar = (id, data) => {
    return prisma.marca.update({
        where: {
            id,
        },
        data,
    });
};
