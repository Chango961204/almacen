import prisma from "../lib/prisma.js";

export const crearDevolucion = async (data, usuarioId) => {
    return prisma.$transaction(async (tx) => {

        const salida = await tx.salida.findUnique({
            where: {
                id: data.salidaId,
            },
            include: {
                detalles: true,
            },
        });

        if (!salida) {
            const error = new Error("La salida no existe");
            error.statusCode = 404;
            throw error;
        }

        const devolucion = await tx.devolucion.create({
            data: {
                folio: data.folio,
                salidaId: data.salidaId,
                fecha: new Date(data.fecha),
                motivo: data.motivo,
                creadoPorId: usuarioId,
            },
        });

        for (const detalle of data.detalles) {

            const salidaDetalle =
                await tx.salidaDetalle.findUnique({
                    where: {
                        id: detalle.salidaDetalleId,
                    },
                });

            if (
                !salidaDetalle ||
                salidaDetalle.salidaId !== data.salidaId
            ) {
                const error = new Error(
                    `El detalle ${detalle.salidaDetalleId} no pertenece a la salida`
                );

                error.statusCode = 400;
                throw error;
            }

            const devolucionesPrevias =
                await tx.devolucionDetalle.aggregate({
                    where: {
                        salidaDetalleId: detalle.salidaDetalleId,
                    },
                    _sum: {
                        cantidad: true,
                    },
                });

            const cantidadDevuelta =
                Number(devolucionesPrevias._sum.cantidad || 0);

            const disponibleParaDevolver =
                Number(salidaDetalle.cantidad) -
                cantidadDevuelta;

            if (
                Number(detalle.cantidad) >
                disponibleParaDevolver
            ) {
                const error = new Error(
                    `No se puede devolver ${detalle.cantidad}. ` +
                    `El máximo disponible para devolver es ${disponibleParaDevolver}`
                );

                error.statusCode = 400;
                throw error;
            }

            await tx.devolucionDetalle.create({
                data: {
                    devolucionId: devolucion.id,
                    salidaDetalleId: detalle.salidaDetalleId,
                    cantidad: detalle.cantidad,
                },
            });

            await tx.inventarioProyecto.update({
                where: {
                    proyectoId_articuloId: {
                        proyectoId: salida.proyectoId,
                        articuloId: salidaDetalle.articuloId,
                    },
                },
                data: {
                    cantidadActual: {
                        increment: detalle.cantidad,
                    },
                },
            });

            await tx.inventarioAlmacen.update({
                where: {
                    articuloId: salidaDetalle.articuloId,
                },
                data: {
                    cantidadActual: {
                        increment: detalle.cantidad,
                    },
                },
            });
        }

        await tx.auditoria.create({
            data: {
                usuarioId,
                accion: "CREAR",
                entidad: "DEVOLUCION",
                entidadId: devolucion.id,
                descripcion: `Devolución ${devolucion.folio} registrada`,
            },
        });

        return tx.devolucion.findUnique({
            where: {
                id: devolucion.id,
            },
            include: {
                salida: true,
                detalles: {
                    include: {
                        salidaDetalle: {
                            include: {
                                articulo: true,
                            },
                        },
                    },
                },
            },
        });
    });
};