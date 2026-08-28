import prisma from '../lib/prisma.js';

export const crearProyecto = async (data) => {
    return prisma.proyecto.create({
        data,
    });
}


export const obtenerProyectos = () => {
    return prisma.proyecto.findMany({
        orderBy: {
            nombre: "asc",
        },
    });
};

export const ObtenerProyectoPorId = (id) => {
    return prisma.proyecto.findUnique({
        where: {
            id,
        },
    });
};

export const actualizarProyecto = (id, data) => {
    return prisma.proyecto.update({
        where: {
            id,
        },
        data,
    });
};
