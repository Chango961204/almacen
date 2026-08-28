import prisma from "../lib/prisma.js";
import * as entradaRepository from "../repositories/entrada.repository.js";

export const crearEntrada = async (data, usuarioId) => {

    return prisma.$transaction(async (tx) => {


        //1. Crear la cabecera de la entrada

        const entrada = await entradaRepository.crear(tx, {
            folioFactura: data.folioFactura || null,

            folioRequisicion: data.folioRequisicion || null,

            fechaRecepcion: new Date(data.fechaRecepcion),

            proveedor: data.proveedor || null,

            distribuidor: data.distribuidor || null,

            observaciones: data.observaciones || null,

            creadoPorId: usuarioId,
        });



        //2. Procesar cada detalle

        for (const detalle of data.detalles) {


            //Verificar proyecto


            const proyecto = await tx.proyecto.findUnique({
                where: {
                    id: detalle.proyectoId,
                },
            });

            if (!proyecto) {

                const error = new Error(
                    `El proyecto ${detalle.proyectoId} no existe`
                );

                error.statusCode = 400;

                throw error;
            }

            if (!proyecto.activo) {

                const error = new Error(
                    `El proyecto ${proyecto.nombre} está inactivo`
                );

                error.statusCode = 400;

                throw error;
            }



            //Verificar artículo


            const articulo =
                await tx.articulo.findUnique({
                    where: {
                        id: detalle.articuloId,
                    },
                });

            if (!articulo) {

                const error = new Error(
                    `El artículo ${detalle.articuloId} no existe`
                );

                error.statusCode = 400;

                throw error;
            }

            if (!articulo.activo) {

                const error = new Error(`El artículo ${articulo.nombre} está inactivo`);

                error.statusCode = 400;

                throw error;
            }



            //Crear detalle de entrada


            await tx.entradaDetalle.create({
                data: {
                    entradaId: entrada.id,
                    proyectoId: detalle.proyectoId,
                    articuloId: detalle.articuloId,
                    cantidad: detalle.cantidad,
                },
            });



            //3. Actualizar INVENTARIO GENERAL


            await tx.inventarioAlmacen.upsert({
                where: {
                    articuloId: detalle.articuloId,
                },

                create: {
                    articuloId: detalle.articuloId,
                    cantidadActual: detalle.cantidad,
                },

                update: {
                    cantidadActual: {
                        increment: detalle.cantidad,
                    },
                },
            });



            //4. Actualizar INVENTARIO DEL PROYECTO


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
                    cantidadActual: detalle.cantidad,
                },

                update: {
                    cantidadActual: {
                        increment: detalle.cantidad,
                    },
                },
            });
        }



        //5. Auditoría


        await tx.auditoria.create({
            data: {
                usuarioId,
                accion: "CREAR",
                entidad: "ENTRADA",
                entidadId: entrada.id,
                descripcion:
                    `Se creó la entrada ${entrada.id}`,
                datos: data,
            },
        });



        //6. Regresar la entrada completa


        return entradaRepository.obtenerPorId(
            tx,
            entrada.id
        );
    });
};

export const obtenerTodas = () => {
    return entradaRepository.obtenerTodas();
};

export const obtenerPorId = async (id) => {

    const entrada =
        await entradaRepository.obtenerPorId(
            prisma,
            id
        );

    if (!entrada) {
        const error = new Error(
            "Entrada no encontrada"
        );

        error.statusCode = 404;

        throw error;
    }

    return entrada;
};