import prisma from "../lib/prisma.js";

export const crear = (tx, data) => {
    return tx.entrada.create({
        data,
    });
};

export const obtenerPorId = (tx, id) => {
    return tx.entrada.findUnique({
        where: {
            id,
        },
        include: {
            creadoPor: {
                select: {
                    id: true,
                    nombre: true,
                    email: true,
                },
            },
            detalles: {
                include: {
                    proyecto: true,
                    articulo: {
                        include: {
                            marca: true,
                            unidadMedida: true,
                        },
                    },
                },
            },
        },
    });
};

export const obtenerTodas = () => {
    return prisma.entrada.findMany({
        orderBy: {
            fechaRecepcion: "desc",
        },
        include: {
            creadoPor: {
                select: {
                    id: true,
                    nombre: true,
                },
            },
            detalles: {
                include: {
                    proyecto: true,
                    articulo: true,
                },
            },
        },
    });
};