import prisma from "../lib/prisma.js";

export const usuarioRepository = {
    findByEmail(email) {
        return prisma.usuario.findUnique({
            where: {
                email,
            },
            include: {
                rol: true,
            },
        });
    },

    findById(id) {
        return prisma.usuario.findUnique({
            where: {
                id,
            },
            include: {
                rol: true,
            },
        });
    },

    create(data) {
        return prisma.usuario.create({
            data,
            include: {
                rol: true,
            },
        });
    },
};