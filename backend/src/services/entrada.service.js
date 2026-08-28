import e from "express";
import prisma from "../lib/prisma.js";

export const crearEntrada = async (data, usuarioId) => {
    return prisma.$transaction(async (tx) => {

        const entrada = await tx.entrada.create({
            data: {
                folioFactura: data.folioFactura || null,
                folioRequisicion: data.folioRequisicion || null,
                fechaRecepcion: new Date(data.fechaRecepcion),
                proveedor: data.proveedor || null,
                distribuidor: data.distribuidor || null,
                observaciones: data.observaciones || null,
                creadoPorId: usuarioId,
            },
        });

        for (const detalle of data.detalles) {
            const proyecto = await tx.proyecto.findUnique({
                where: {
                    id: detalle.proyectoId,
                },
            });

            if (!proyecto || !proyecto.activo) {
                const error = new Error(
                    `El proyectoo ${detalle.proyectoId} no existe o esta inactivo`
                );
                error.statusCode = 400;
                throw error;
            }

            const articulo = await tx.articulo.findUnique({
                where: {
                    id: detalle.articuloId,
                },
            });
            if (!articulo || !articulo.activo) {
                const error = new Error(
                    `El articulo ${detalle.articuloId} no existe o esta inactivo`
                );
                error.statusCode = 400;
                throw error;
            }
            await tx.entradaDetalle.create({
                data: {
                    entradaId: entrada.id,
                    proyectoId: detalle.proyectoId,
                    articuloId: detalle.articuloId,
                    cantidad: detalle.cantidadm
                },
            });

            await tx.inventarioAlmacen.upsert({
                where: {
                    articuloId: detalle.articuloId,
                },
                create: {
                    articuloId: detalle.articuloId,
                    cantidadActual: detalle.cantidad
                },
                update: {
                    cantidadActual: {
                        increment: detalle.cantidad,
                    },
                },
            });
            await tx.inventarioProyecto.upsert({
                where: {
                    proyectoId_articuloId: {
                        proyectoId: detalle.proyectoId,
                        articuloId: detalle.articuloId,
                    },
                },
                create: {
                    proyectoId: detalle.proyectoId,
                    articuloId: detalle.articuloId,
                    cantidadActual: detalle.cantidad
                },
                update: {
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
                entidad: "ENTRADA",
                entidadId: entrada.id,
                descripcion: `Entrada ${entrada.id} registrada`,
            },
        });

        return tx.entrada.findUnique({
            where: {
                id: entrada.id,
            },
            include: {
                detalles: {
                    include: {
                        proyecto: true,
                        articulo: true,
                    },
                },
            },
        });
    });
};

