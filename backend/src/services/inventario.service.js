import prisma from "../lib/prisma.js";

const incluirArticulo = {
    articulo: {
        include: {
            marca: true,
            unidadMedida: true,
        },
    },
};

const ordenarPorArticulo = {
    articulo: {
        nombre: "asc",
    },
};

// Filtro para existencias positivas. El reporte detallado incluye también
// artículos inactivos que todavía tengan existencia, marcándolos en el PDF.
const soloExistencias = {
    cantidadActual: {
        gt: 0,
    },
};

const soloExistenciasActivas = {
    ...soloExistencias,
    articulo: {
        activo: true,
    },
};

const redondear = (valor) =>
    Math.round((Number(valor) + Number.EPSILON) * 1000) / 1000;

const sumarCantidad = (detalles) =>
    detalles.reduce(
        (total, detalle) => total + Number(detalle.cantidad || 0),
        0
    );

const fechaParaOrdenar = (valor) => {
    const fecha = new Date(valor).getTime();
    return Number.isNaN(fecha) ? 0 : fecha;
};

const ordenarMovimientos = (a, b, campoFecha) => {
    const diferenciaFecha =
        fechaParaOrdenar(a[campoFecha]) - fechaParaOrdenar(b[campoFecha]);

    if (diferenciaFecha !== 0) return diferenciaFecha;

    const diferenciaId = Number(a.id) - Number(b.id);
    if (diferenciaId !== 0) return diferenciaId;

    return Number(a.detalleId) - Number(b.detalleId);
};

const crearResumenPorArticulo = ({
    inventario,
    entradas,
    salidas,
    devoluciones,
}) => {
    const mapa = new Map();

    const obtener = (articulo) => {
        if (!mapa.has(articulo.id)) {
            mapa.set(articulo.id, {
                articulo,
                entradas: 0,
                salidas: 0,
                devoluciones: 0,
                stockActual: 0,
            });
        }

        return mapa.get(articulo.id);
    };

    inventario.forEach((fila) => {
        const item = obtener(fila.articulo);
        item.stockActual += Number(fila.cantidadActual || 0);
    });

    entradas.forEach((fila) => {
        obtener(fila.articulo).entradas += Number(fila.cantidad || 0);
    });

    salidas.forEach((fila) => {
        obtener(fila.articulo).salidas += Number(fila.cantidad || 0);
    });

    devoluciones.forEach((fila) => {
        obtener(fila.articulo).devoluciones += Number(fila.cantidad || 0);
    });

    return Array.from(mapa.values())
        .map((item) => ({
            ...item,
            diferencia: redondear(
                item.stockActual -
                    (item.entradas - item.salidas + item.devoluciones)
            ),
        }))
        .sort((a, b) => a.articulo.nombre.localeCompare(b.articulo.nombre, "es"));
};

export const obtenerInventarioAlmacen = async () => {
    return prisma.inventarioAlmacen.findMany({
        where: {
            ...soloExistenciasActivas,
        },
        include: incluirArticulo,
        orderBy: ordenarPorArticulo,
    });
};

export const obtenerInventarioProyecto = async (proyectoId) => {

    const proyecto = await prisma.proyecto.findUnique({
        where: {
            id: proyectoId,
        },
    });

    if (!proyecto) {
        const error = new Error("Proyecto no encontrado");
        error.statusCode = 404;
        throw error;
    }

    return prisma.inventarioProyecto.findMany({
        where: {
            proyectoId,
            ...soloExistenciasActivas,
        },
        include: incluirArticulo,
        orderBy: ordenarPorArticulo,
    });
};

// Inventario completo para el reporte PDF general:
// - almacen: existencias del almacén general.
// - proyectos: todos los proyectos, con su información de creación y
//   conteos de actividad. Los inactivos se marcan en el PDF.
export const obtenerInventarioGeneral = async () => {
    const [almacen, proyectos, salidas] = await Promise.all([
        obtenerInventarioAlmacen(),
        prisma.proyecto.findMany({
            orderBy: [
                { activo: "desc" },
                { nombre: "asc" },
                { creadoEn: "asc" },
            ],
            include: {
                inventarios: {
                    where: {
                        ...soloExistenciasActivas,
                    },
                    include: incluirArticulo,
                    orderBy: ordenarPorArticulo,
                },
                _count: {
                    select: {
                        entradas: true,
                        salidas: true,
                    },
                },
            },
        }),
        prisma.salida.findMany({
            select: {
                proyectoId: true,
                _count: {
                    select: {
                        devoluciones: true,
                    },
                },
            },
        }),
    ]);

    const devolucionesPorProyecto = salidas.reduce((acumulado, salida) => {
        acumulado[salida.proyectoId] =
            (acumulado[salida.proyectoId] || 0) +
            salida._count.devoluciones;

        return acumulado;
    }, {});

    return {
        almacen,
        proyectos: proyectos.map((proyecto) => ({
            id: proyecto.id,
            nombre: proyecto.nombre,
            descripcion: proyecto.descripcion,
            activo: proyecto.activo,
            creadoEn: proyecto.creadoEn,
            fechaInicio: proyecto.fechaInicio,
            fechaFin: proyecto.fechaFin,
            actualizadoEn: proyecto.actualizadoEn,
            inventarios: proyecto.inventarios,
            resumen: {
                articulos: proyecto.inventarios.length,
                entradas: proyecto._count.entradas,
                salidas: proyecto._count.salidas,
                devoluciones: devolucionesPorProyecto[proyecto.id] || 0,
            },
        })),
    };
};

// Reporte detallado de un proyecto: datos del proyecto, inventario actual,
// entradas, salidas, devoluciones y resumen por artículo. Las filas se
// devuelven ya normalizadas para que el PDF no tenga que reconstruir relaciones.
export const obtenerReporteProyecto = async (proyectoId) => {
    const id = Number(proyectoId);

    if (!Number.isInteger(id) || id <= 0) {
        const error = new Error("El proyecto no es válido");
        error.statusCode = 400;
        throw error;
    }

    const proyecto = await prisma.proyecto.findUnique({
        where: {
            id,
        },
    });

    if (!proyecto) {
        const error = new Error("Proyecto no encontrado");
        error.statusCode = 404;
        throw error;
    }

    const [inventario, entradas, salidas, devoluciones] = await Promise.all([
        prisma.inventarioProyecto.findMany({
            where: {
                proyectoId: id,
                ...soloExistencias,
            },
            include: incluirArticulo,
            orderBy: ordenarPorArticulo,
        }),
        prisma.entradaDetalle.findMany({
            where: {
                proyectoId: id,
            },
            include: {
                entrada: {
                    include: {
                        creadoPor: {
                            select: {
                                id: true,
                                nombre: true,
                            },
                        },
                    },
                },
                articulo: incluirArticulo.articulo,
            },
        }),
        prisma.salida.findMany({
            where: {
                proyectoId: id,
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
                        articulo: incluirArticulo.articulo,
                        devoluciones: {
                            select: {
                                cantidad: true,
                            },
                        },
                    },
                },
            },
        }),
        prisma.devolucion.findMany({
            where: {
                salida: {
                    proyectoId: id,
                },
            },
            include: {
                salida: {
                    select: {
                        id: true,
                        folio: true,
                        fecha: true,
                        responsable: true,
                    },
                },
                creadoPor: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
                detalles: {
                    include: {
                        salidaDetalle: {
                            include: {
                                articulo: incluirArticulo.articulo,
                            },
                        },
                    },
                },
            },
        }),
    ]);

    const entradasNormalizadas = entradas
        .map((detalle) => ({
            id: detalle.entrada.id,
            detalleId: detalle.id,
            fechaRecepcion: detalle.entrada.fechaRecepcion,
            folioFactura: detalle.entrada.folioFactura,
            folioRequisicion: detalle.entrada.folioRequisicion,
            proveedor: detalle.entrada.proveedor,
            distribuidor: detalle.entrada.distribuidor,
            observaciones: detalle.entrada.observaciones,
            estado: detalle.entrada.estado,
            creadoEn: detalle.entrada.creadoEn,
            creadoPor: detalle.entrada.creadoPor,
            articulo: detalle.articulo,
            cantidad: Number(detalle.cantidad),
        }))
        .sort((a, b) => ordenarMovimientos(a, b, "fechaRecepcion"));

    const salidasNormalizadas = salidas
        .flatMap((salida) =>
            salida.detalles.map((detalle) => ({
                id: salida.id,
                detalleId: detalle.id,
                folio: salida.folio,
                fecha: salida.fecha,
                responsable: salida.responsable,
                observaciones: salida.observaciones,
                estado: salida.estado,
                creadoEn: salida.creadoEn,
                creadoPor: salida.creadoPor,
                articulo: detalle.articulo,
                cantidad: Number(detalle.cantidad),
                cantidadDevuelta: redondear(
                    sumarCantidad(detalle.devoluciones)
                ),
            }))
        )
        .sort((a, b) => ordenarMovimientos(a, b, "fecha"));

    const devolucionesNormalizadas = devoluciones
        .flatMap((devolucion) =>
            devolucion.detalles.map((detalle) => ({
                id: devolucion.id,
                detalleId: detalle.id,
                folio: devolucion.folio,
                fecha: devolucion.fecha,
                motivo: devolucion.motivo,
                estado: devolucion.estado,
                creadoEn: devolucion.creadoEn,
                creadoPor: devolucion.creadoPor,
                salida: devolucion.salida,
                articulo: detalle.salidaDetalle.articulo,
                cantidad: Number(detalle.cantidad),
            }))
        )
        .sort((a, b) => ordenarMovimientos(a, b, "fecha"));

    const resumenPorArticulo = crearResumenPorArticulo({
        inventario,
        entradas: entradasNormalizadas,
        salidas: salidasNormalizadas,
        devoluciones: devolucionesNormalizadas,
    });

    return {
        proyecto: {
            id: proyecto.id,
            nombre: proyecto.nombre,
            descripcion: proyecto.descripcion,
            activo: proyecto.activo,
            creadoEn: proyecto.creadoEn,
            fechaInicio: proyecto.fechaInicio,
            fechaFin: proyecto.fechaFin,
            actualizadoEn: proyecto.actualizadoEn,
        },
        inventario,
        entradas: entradasNormalizadas,
        salidas: salidasNormalizadas,
        devoluciones: devolucionesNormalizadas,
        resumenPorArticulo,
        totales: {
            articulosConExistencia: inventario.length,
            entradas: entradasNormalizadas.length,
            salidas: salidasNormalizadas.length,
            devoluciones: devolucionesNormalizadas.length,
        },
    };
};
