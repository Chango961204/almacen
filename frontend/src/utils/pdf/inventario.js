import { GRIS, MARGEN, OSCURO } from "./constantes.js";
import {
    agregarCabecerasSecundarias,
    agregarPie,
    agregarSeccionExistencias,
    agregarTabla,
    asegurarEspacio,
    cargarLibrerias,
    dibujarEncabezado,
} from "./layout.js";
import {
    etiquetaProyecto,
    fechaArchivo,
    fechaSola,
    formatearCantidad,
    nombreProyecto,
    slugArchivo,
    totalExistencia,
} from "./formato.js";

function agregarResumenGeneral(doc, autoTable, proyectos, y, margen) {
    const cuerpo = proyectos.map((proyecto) => [
        `${nombreProyecto(proyecto)} (#${proyecto.id})`,
        proyecto.activo ? "Activo" : "Inactivo",
        fechaSola(proyecto.creadoEn),
        String(
            proyecto.resumen?.articulos ??
                (proyecto.inventarios || []).length
        ),
        String(proyecto.resumen?.entradas ?? 0),
        String(proyecto.resumen?.salidas ?? 0),
        String(proyecto.resumen?.devoluciones ?? 0),
    ]);

    return agregarTabla(doc, autoTable, {
        titulo: "RESUMEN DE PROYECTOS",
        head: [
            "Proyecto",
            "Estado",
            "Creado el",
            "Artículos",
            "Entradas",
            "Salidas",
            "Devoluciones",
        ],
        body: cuerpo,
        y,
        emptyMessage: "No hay proyectos registrados",
        fontSize: 7.2,
        margen,
        columnStyles: {
            0: { cellWidth: 70 },
            1: { cellWidth: 18, halign: "center" },
            2: { cellWidth: 22, halign: "center" },
            3: { cellWidth: 18, halign: "right" },
            4: { cellWidth: 18, halign: "right" },
            5: { cellWidth: 14, halign: "right" },
            6: { cellWidth: 22, halign: "right" },
        },
        notas: [
            "Artículos = artículos con existencia actual. Entradas = partidas de entrada asignadas al proyecto. Salidas y devoluciones = registros.",
            "Las existencias actuales muestran únicamente artículos activos. Para el detalle de movimientos, genere el PDF del proyecto.",
        ],
    });
}

export async function crearPdfInventarioGeneral({
    almacen = [],
    proyectos = [],
    usuario,
} = {}) {
    const { jsPDF, autoTable } = await cargarLibrerias();
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    doc.setProperties({
        title: "Inventario general",
        subject: "Almacén, proyectos y resumen de actividad",
        author: "Sistema de Almacén",
        creator: "Sistema de Almacén",
    });

    let y = dibujarEncabezado(doc, {
        titulo: "INVENTARIO GENERAL",
        subtitulo: "Almacén, proyectos y resumen de actividad",
        usuario,
    });

    y = agregarResumenGeneral(doc, autoTable, proyectos, y, MARGEN);
    y = agregarSeccionExistencias(
        doc,
        autoTable,
        "ALMACÉN GENERAL",
        almacen,
        y
    );

    const proyectosConExistencias = proyectos.filter(
        (proyecto) => (proyecto.inventarios || []).length > 0
    );

    for (const proyecto of proyectosConExistencias) {
        y = agregarSeccionExistencias(
            doc,
            autoTable,
            `PROYECTO: ${etiquetaProyecto(proyecto)}`,
            proyecto.inventarios || [],
            y,
            {
                nota:
                    proyecto.activo === false
                        ? "Proyecto inactivo; se conserva su inventario y historial para consulta."
                        : undefined,
            }
        );
    }

    if (!proyectosConExistencias.length) {
        y = asegurarEspacio(doc, y, 12);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(...GRIS);
        doc.text(
            "No hay proyectos con existencia actual.",
            MARGEN,
            y + 4
        );
    }

    agregarCabecerasSecundarias(doc, {
        etiqueta: "Inventario general",
        detalle: "Inventario general",
    });
    agregarPie(doc, {
        etiqueta: "Inventario general",
    });

    return doc;
}

export async function exportarInventarioGeneralPdf(datos = {}) {
    const doc = await crearPdfInventarioGeneral(datos);
    doc.save(`inventario-general-${fechaArchivo()}.pdf`);
}

export async function crearPdfInventarioProyecto({
    proyecto,
    filas = [],
    usuario,
} = {}) {
    const { jsPDF, autoTable } = await cargarLibrerias();
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    doc.setProperties({
        title: `Inventario del proyecto ${proyecto?.nombre || ""}`.trim(),
        subject: "Inventario por proyecto",
        author: "Sistema de Almacén",
        creator: "Sistema de Almacén",
    });

    let y = dibujarEncabezado(doc, {
        titulo: "INVENTARIO DEL PROYECTO",
        subtitulo: proyecto?.nombre
            ? `Proyecto: ${nombreProyecto(proyecto)}`
            : "",
        usuario,
    });

    y = agregarSeccionExistencias(
        doc,
        autoTable,
        "EXISTENCIAS",
        filas,
        y
    );

    if (filas.length) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...OSCURO);
        doc.text(
            `Total de artículos: ${filas.length} · Existencia total: ${formatearCantidad(
                totalExistencia(filas)
            )}`,
            MARGEN,
            y
        );
    }

    agregarCabecerasSecundarias(doc, {
        etiqueta: "Inventario del proyecto",
        detalle: proyecto?.nombre
            ? etiquetaProyecto(proyecto)
            : "Inventario del proyecto",
    });
    agregarPie(doc, {
        etiqueta: "Inventario del proyecto",
    });

    return doc;
}

export async function exportarInventarioProyectoPdf(datos = {}) {
    const doc = await crearPdfInventarioProyecto(datos);
    doc.save(
        `inventario-proyecto-${slugArchivo(
            datos.proyecto?.nombre
        )}-${fechaArchivo()}.pdf`
    );
}
