import  prisma from "../lib/prisma.js";

export const obtenerTodas = (filtros = {}) => {
    const where = {};

    if (filtros.entidad) where.entidad = filtros.entidad;
    if (filtros.accion) where.accion = filtros.accion;
    if (filtros.usuarioId) where.usuarioId = Number(filtros.usuarioId);

    if (filtros.desde || filtros.hasta) {
        where.creadoEn = {};

        if (filtros.desde) {
            where.creadoEn.gte = new Date(`${filtros.desde}T00:00:00.000Z`);
        }

        if (filtros.hasta) {
            where.creadoEn.lte = new Date(`${filtros.hasta}T23:59:59.999Z`);
        }
    }

    return prisma.auditoria.findMany({
        where,
        orderBy: {
            creadoEn: "desc",
        },
        include: {
            usuario: {
                select: {
                    id: true,
                    nombre: true,
                    email: true,
                    rol: { select: { nombre: true } },
                },
            },
        },
    });
};