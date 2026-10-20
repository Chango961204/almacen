import { MARGEN_HORIZONTAL } from "./constantes.js";
import {
    agregarCabecerasSecundarias,
    agregarPie,
    agregarSeccionExistencias,
    agregarTabla,
    cargarLibrerias,
    dibujarEncabezado,
} from "./layout.js";
import {
    agregarActaEntrega,
    agregarDatosProyecto,
    agregarResumenProyecto,
} from "./bloquesReporte.js";
import {
    crearCuerpoDevoluciones,
    crearCuerpoEntradas,
    crearCuerpoResumenPorArticulo,
    crearCuerpoSalidas,
    hayDiferenciasResumen,
} from "./filasReporte.js";
import {
    calcularRangoMovimientos,
    etiquetaProyecto,
    fechaArchivo,
    nombreProyecto,
    slugArchivo,
} from "./formato.js";

export async function crearPdfReporteProyecto({
    reporte,
    usuario,
} = {}) {
    const {
        proyecto = {},
        inventario = [],
        entradas = [],
        salidas = [],
        devoluciones = [],
        resumenPorArticulo = [],
        totales = {},
    } = reporte || {};

    const { jsPDF, autoTable } = await cargarLibrerias();
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
    });

    const margen = MARGEN_HORIZONTAL;

    doc.setProperties({
        title: `Reporte del proyecto ${proyecto.nombre || ""}`.trim(),
        subject: "Inventario, entradas, salidas y devoluciones",
        author: "Sistema de Almacén",
        creator: "Sistema de Almacén",
    });

    let y = dibujarEncabezado(doc, {
        titulo: "REPORTE DE PROYECTO",
        subtitulo: `Proyecto: ${nombreProyecto(
            proyecto
        )} (#${proyecto.id}) · Estado: ${proyecto.activo ? "Activo" : "Inactivo"}`,
        usuario,
        margen,
    });

    y = agregarDatosProyecto(
        doc,
        autoTable,
        proyecto,
        usuario,
        y,
        margen
    );

    y = agregarResumenProyecto(
        doc,
        autoTable,
        totales,
        calcularRangoMovimientos(entradas, salidas, devoluciones),
        y,
        margen
    );

    const hayArticulosInactivos = inventario.some(
        (fila) => fila.articulo?.activo === false
    );

    y = agregarSeccionExistencias(
        doc,
        autoTable,
        "INVENTARIO ACTUAL DEL PROYECTO",
        inventario,
        y,
        {
            margen,
            nota: hayArticulosInactivos
                ? "Los artículos marcados como inactivos se conservan en este reporte por tener existencia."
                : undefined,
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 118 },
                2: { cellWidth: 65 },
                3: { cellWidth: 25, halign: "center" },
                4: { cellWidth: 35, halign: "right" },
            },
        }
    );

    y = agregarTabla(doc, autoTable, {
        titulo: "ENTRADAS AL PROYECTO",
        head: [
            "#",
            "Fecha recepción",
            "Factura / Requisición",
            "Proveedor / Distribuidor",
            "Artículo",
            "Cantidad",
            "Observaciones",
            "Estado",
            "Registro",
        ],
        body: crearCuerpoEntradas(entradas),
        y,
        margen,
        fontSize: 6.9,
        emptyMessage: "Sin entradas registradas para este proyecto.",
        estadoIndex: 7,
        columnStyles: {
            0: { cellWidth: 10, halign: "center" },
            1: { cellWidth: 20, halign: "center" },
            2: { cellWidth: 34 },
            3: { cellWidth: 42 },
            4: { cellWidth: 55 },
            5: { cellWidth: 20, halign: "right" },
            6: { cellWidth: 48 },
            7: { cellWidth: 18, halign: "center" },
            8: { cellWidth: 26 },
        },
        notas: [
            "Una entrada puede distribuirse entre varios proyectos; esta tabla muestra únicamente la cantidad asignada a este proyecto.",
        ],
    });

    y = agregarTabla(doc, autoTable, {
        titulo: "SALIDAS DEL PROYECTO",
        head: [
            "#",
            "Fecha salida",
            "Folio",
            "Responsable",
            "Artículo",
            "Cantidad",
            "Devuelto",
            "Observaciones",
            "Estado",
            "Registro",
        ],
        body: crearCuerpoSalidas(salidas),
        y,
        margen,
        fontSize: 6.9,
        emptyMessage: "Sin salidas registradas para este proyecto.",
        estadoIndex: 8,
        columnStyles: {
            0: { cellWidth: 10, halign: "center" },
            1: { cellWidth: 20, halign: "center" },
            2: { cellWidth: 24 },
            3: { cellWidth: 32 },
            4: { cellWidth: 55 },
            5: { cellWidth: 20, halign: "right" },
            6: { cellWidth: 18, halign: "right" },
            7: { cellWidth: 42 },
            8: { cellWidth: 18, halign: "center" },
            9: { cellWidth: 34 },
        },
        notas: [
            "La columna Devuelto suma las devoluciones registradas para ese artículo en esta salida.",
        ],
    });

    y = agregarTabla(doc, autoTable, {
        titulo: "DEVOLUCIONES DEL PROYECTO",
        head: [
            "#",
            "Fecha devolución",
            "Folio",
            "Salida",
            "Motivo",
            "Artículo",
            "Cantidad",
            "Estado",
            "Registro",
        ],
        body: crearCuerpoDevoluciones(devoluciones),
        y,
        margen,
        fontSize: 6.9,
        emptyMessage: "Sin devoluciones registradas para este proyecto.",
        estadoIndex: 7,
        columnStyles: {
            0: { cellWidth: 10, halign: "center" },
            1: { cellWidth: 24, halign: "center" },
            2: { cellWidth: 24 },
            3: { cellWidth: 24 },
            4: { cellWidth: 55 },
            5: { cellWidth: 60 },
            6: { cellWidth: 20, halign: "right" },
            7: { cellWidth: 18, halign: "center" },
            8: { cellWidth: 38 },
        },
    });

    const hayDiferencias = hayDiferenciasResumen(resumenPorArticulo);

    y = agregarTabla(doc, autoTable, {
        titulo: "RESUMEN POR ARTÍCULO",
        head: [
            "Código",
            "Artículo",
            "Unidad",
            "Entradas",
            "Salidas",
            "Devoluciones",
            "Existencia actual",
            "Diferencia",
        ],
        body: crearCuerpoResumenPorArticulo(resumenPorArticulo),
        y,
        margen,
        fontSize: 7,
        emptyMessage: "Sin artículos con movimientos o existencia.",
        columnStyles: {
            0: { cellWidth: 24 },
            1: { cellWidth: 95 },
            2: { cellWidth: 20, halign: "center" },
            3: { cellWidth: 24, halign: "right" },
            4: { cellWidth: 22, halign: "right" },
            5: { cellWidth: 28, halign: "right" },
            6: { cellWidth: 34, halign: "right" },
            7: { cellWidth: 26, halign: "right" },
        },
        notas: [
            "Diferencia = existencia actual - (entradas - salidas + devoluciones). Una diferencia distinta de cero indica que la existencia actual no coincide con el historial.",
            hayDiferencias
                ? "Hay artículos con diferencia; revise la columna Diferencia."
                : "La existencia actual coincide con el historial en todos los artículos.",
        ],
    });

    y = agregarActaEntrega(doc, proyecto, y, margen);

    agregarCabecerasSecundarias(doc, {
        etiqueta: "Reporte de proyecto",
        detalle: etiquetaProyecto(proyecto),
        margen,
    });
    agregarPie(doc, {
        etiqueta: "Reporte de proyecto",
        margen,
    });

    return doc;
}

export async function exportarReporteProyectoPdf({
    reporte,
    usuario,
} = {}) {
    const doc = await crearPdfReporteProyecto({
        reporte,
        usuario,
    });

    const proyecto = reporte?.proyecto || {};
    const id = proyecto.id ? `-${proyecto.id}` : "";

    doc.save(
        `reporte-proyecto-${slugArchivo(
            proyecto.nombre
        )}${id}-${fechaArchivo()}.pdf`
    );
}
