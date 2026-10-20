import {
    cantidadConUnidad,
    codigoArticulo,
    descripcionArticulo,
    fechaHora,
    fechaSola,
    formatearCantidad,
    nombreArticulo,
    texto,
    unidadArticulo,
} from "./formato.js";

export function crearCuerpoEntradas(entradas = []) {
    return entradas.map((entrada) => [
        String(entrada.id),
        fechaSola(entrada.fechaRecepcion),
        `Factura: ${texto(entrada.folioFactura)}\nReq: ${texto(
            entrada.folioRequisicion
        )}`,
        `Proveedor: ${texto(
            entrada.proveedor
        )}\nDistribuidor: ${texto(entrada.distribuidor)}`,
        descripcionArticulo(entrada.articulo),
        cantidadConUnidad(entrada.cantidad, entrada.articulo),
        texto(entrada.observaciones),
        entrada.estado || "—",
        `${texto(entrada.creadoPor?.nombre)}\n${fechaHora(
            entrada.creadoEn
        )}`,
    ]);
}

export function crearCuerpoSalidas(salidas = []) {
    return salidas.map((salida) => [
        String(salida.id),
        fechaSola(salida.fecha),
        texto(salida.folio),
        texto(salida.responsable),
        descripcionArticulo(salida.articulo),
        cantidadConUnidad(salida.cantidad, salida.articulo),
        cantidadConUnidad(salida.cantidadDevuelta, salida.articulo),
        texto(salida.observaciones),
        salida.estado || "—",
        `${texto(salida.creadoPor?.nombre)}\n${fechaHora(
            salida.creadoEn
        )}`,
    ]);
}

export function crearCuerpoDevoluciones(devoluciones = []) {
    return devoluciones.map((devolucion) => [
        String(devolucion.id),
        fechaSola(devolucion.fecha),
        texto(devolucion.folio),
        texto(devolucion.salida?.folio),
        texto(devolucion.motivo),
        descripcionArticulo(devolucion.articulo),
        cantidadConUnidad(devolucion.cantidad, devolucion.articulo),
        devolucion.estado || "—",
        `${texto(devolucion.creadoPor?.nombre)}\n${fechaHora(
            devolucion.creadoEn
        )}`,
    ]);
}

export function crearCuerpoResumenPorArticulo(resumenPorArticulo = []) {
    return resumenPorArticulo.map((item) => [
        codigoArticulo(item.articulo),
        nombreArticulo(item.articulo),
        unidadArticulo(item.articulo),
        formatearCantidad(item.entradas),
        formatearCantidad(item.salidas),
        formatearCantidad(item.devoluciones),
        formatearCantidad(item.stockActual),
        formatearCantidad(item.diferencia),
    ]);
}

export function hayDiferenciasResumen(resumenPorArticulo = []) {
    return resumenPorArticulo.some(
        (item) => Number(item.diferencia) !== 0
    );
}
