import prisma from "../lib/prisma.js";

export const crearSalida = async (data, usuarioId) => {
    return prisma.$transaction(async (tx) => {

        const proyecto = await tx.proyecto.findUnique({
            where: {
                id: data.proyectoId,
            },
        });

        if (!proyecto || !proyecto.activo) {
            const error = new Error(
                "El proyecto no existe o está inactivo"
            );

            error.statusCode = 400;
            throw error;
        }

        const salida = await tx.salida.create({
            data: {
                folio: data.folio,
                proyectoId: data.proyectoId,
                fecha: new Date(data.fecha),
                responsable: data.responsable || null,
                observaciones: data.observaciones || null,
                creadoPorId: usuarioId,
            },
        });

        for (const detalle of data.detalles) {

            const inventarioProyecto =
                await tx.inventarioProyecto.findUnique({
                    where: {
                        proyectoId_articuloId: {
                            proyectoId: data.proyectoId,
                            articuloId: detalle.articuloId,
                        },
                    },
                });

            if (!inventarioProyecto) {
                const error = new Error(
                    `El artículo ${detalle.articuloId} no tiene existencia en este proyecto`
                );

                error.statusCode = 400;
                throw error;
            }

            if (
                Number(inventarioProyecto.cantidadActual) <
                Number(detalle.cantidad)
            ) {
                const error = new Error(
                    `Existencia insuficiente para el artículo ${detalle.articuloId}. ` +
                    `Disponible: ${inventarioProyecto.cantidadActual}. ` +
                    `Solicitado: ${detalle.cantidad}`
                );

                error.statusCode = 400;
                throw error;
            }

            await tx.salidaDetalle.create({
                data: {
                    salidaId: salida.id,
                    articuloId: detalle.articuloId,
                    cantidad: detalle.cantidad,
                },
            });

            await tx.inventarioProyecto.update({
                where: {
                    proyectoId_articuloId: {
                        proyectoId: data.proyectoId,
                        articuloId: detalle.articuloId,
                    },
                },
                data: {
                    cantidadActual: {
                        decrement: detalle.cantidad,
                    },
                },
            });

            await tx.inventarioAlmacen.update({
                where: {
                    articuloId: detalle.articuloId,
                },
                data: {
                    cantidadActual: {
                        decrement: detalle.cantidad,
                    },
                },
            });
        }

        await tx.auditoria.create({
            data: {
                usuarioId,
                accion: "CREAR",
                entidad: "SALIDA",
                entidadId: salida.id,
                descripcion: `Salida ${salida.folio} registrada`,
            },
        });

        return tx.salida.findUnique({
            where: {
                id: salida.id,
            },
            include: {
                proyecto: true,
                detalles: {
                    include: {
                        articulo: true,
                    },
                },
            },
        });
    });
};