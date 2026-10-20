const AZUL = [37, 99, 235];
const OSCURO = [30, 41, 59];
const GRIS = [100, 116, 139];
const BORDE = [226, 232, 240];

const MARGEN = 14;
const COLUMNAS = ["Código", "Artículo", "Marca", "Unidad", "Existencia"];

export function formatearCantidad(valor) {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) return "0";

    return numero.toLocaleString("es-MX", {
        maximumFractionDigits: 3,
    });
}

export function slugArchivo(texto) {
    const limpio = String(texto || "proyecto")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return limpio || "proyecto";
}

function fechaArchivo() {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}

function fechaReporte() {
    return new Date().toLocaleString("es-MX", {
        dateStyle: "short",
        timeStyle: "short",
    });
}

function filaPdf(fila) {
    return [
        fila.articulo?.codigo || "—",
        fila.articulo?.nombre || "—",
        fila.articulo?.marca?.nombre || "—",
        fila.articulo?.unidadMedida?.simbolo || "—",
        formatearCantidad(fila.cantidadActual),
    ];
}

function totalExistencia(filas) {
    return filas.reduce(
        (total, fila) => total + Number(fila.cantidadActual || 0),
        0
    );
}

function nombreProyecto(proyecto) {
    return proyecto?.activo === false
        ? `${proyecto.nombre} (inactivo)`
        : proyecto?.nombre || "Proyecto";
}

function dibujarEncabezado(doc, titulo, subtitulo, usuario) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...AZUL);
    doc.text("SISTEMA DE ALMACÉN", MARGEN, 18);

    doc.setFontSize(16);
    doc.setTextColor(...OSCURO);
    doc.text(titulo, MARGEN, 27);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...GRIS);

    const generado = `Generado: ${fechaReporte()}${
        usuario?.nombre ? ` · Usuario: ${usuario.nombre}` : ""
    }`;

    doc.text(generado, MARGEN, 33);

    if (subtitulo) {
        doc.text(subtitulo, MARGEN, 38);
    }

    doc.setDrawColor(203, 213, 225);
    doc.line(MARGEN, 41, doc.internal.pageSize.getWidth() - MARGEN, 41);

    return 48;
}

function asegurarEspacio(doc, y, necesario) {
    if (y + necesario > doc.internal.pageSize.getHeight() - 18) {
        doc.addPage();
        return 20;
    }

    return y;
}

function agregarResumen(doc, autoTable, almacen, proyectos, y) {
    const cuerpo = [
        [
            "Almacén general",
            String(almacen.length),
            formatearCantidad(totalExistencia(almacen)),
        ],
        ...proyectos.map((proyecto) => [
            nombreProyecto(proyecto),
            String((proyecto.inventarios || []).length),
            formatearCantidad(totalExistencia(proyecto.inventarios || [])),
        ]),
    ];

    let inicio = asegurarEspacio(doc, y, 30);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...OSCURO);
    doc.text("RESUMEN", MARGEN, inicio);

    inicio += 3;

    autoTable(doc, {
        startY: inicio,
        head: [["Proyecto", "Artículos", "Existencia"]],
        body: cuerpo,
        theme: "grid",
        margin: { left: MARGEN, right: MARGEN, top: 18, bottom: 16 },
        styles: {
            font: "helvetica",
            fontSize: 8,
            cellPadding: 2,
            textColor: OSCURO,
            lineColor: BORDE,
            lineWidth: 0.1,
        },
        headStyles: {
            fillColor: OSCURO,
            textColor: [255, 255, 255],
            fontStyle: "bold",
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252],
        },
        columnStyles: {
            1: { halign: "right", cellWidth: 20 },
            2: { halign: "right", cellWidth: 26 },
        },
    });

    let fin = (doc.lastAutoTable?.finalY || inicio) + 4;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(...GRIS);
    doc.text(
        "La columna Existencia suma cantidades de distintas unidades de medida.",
        MARGEN,
        fin
    );

    return fin + 8;
}

function agregarSeccion(doc, autoTable, titulo, filas, y) {
    let inicio = asegurarEspacio(doc, y, 24);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...OSCURO);
    doc.text(titulo, MARGEN, inicio);

    inicio += 3;

    if (!filas.length) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(...GRIS);
        doc.text("Sin existencias registradas", MARGEN, inicio + 4);

        return inicio + 10;
    }

    autoTable(doc, {
        startY: inicio,
        head: [COLUMNAS],
        body: filas.map(filaPdf),
        theme: "grid",
        margin: { left: MARGEN, right: MARGEN, top: 18, bottom: 16 },
        styles: {
            font: "helvetica",
            fontSize: 8,
            cellPadding: 2,
            textColor: OSCURO,
            lineColor: BORDE,
            lineWidth: 0.1,
        },
        headStyles: {
            fillColor: AZUL,
            textColor: [255, 255, 255],
            fontStyle: "bold",
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252],
        },
        columnStyles: {
            0: { cellWidth: 24 },
            4: { halign: "right", cellWidth: 22 },
        },
    });

    return (doc.lastAutoTable?.finalY || inicio) + 8;
}

function agregarPie(doc) {
    const totalPaginas = doc.getNumberOfPages();
    const ancho = doc.internal.pageSize.getWidth();
    const alto = doc.internal.pageSize.getHeight();

    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
        doc.setPage(pagina);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(...GRIS);
        doc.text("Sistema de Almacén", MARGEN, alto - 8);
        doc.text(`Página ${pagina} de ${totalPaginas}`, ancho - MARGEN, alto - 8, {
            align: "right",
        });
    }
}

async function cargarLibrerias() {
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
    ]);

    return { jsPDF, autoTable };
}

export async function crearPdfInventarioGeneral({
    almacen = [],
    proyectos = [],
    usuario,
} = {}) {
    const { jsPDF, autoTable } = await cargarLibrerias();
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    doc.setProperties({
        title: "Inventario general",
        subject: "Almacén y existencias por proyecto",
        author: "Sistema de Almacén",
        creator: "Sistema de Almacén",
    });

    let y = dibujarEncabezado(
        doc,
        "INVENTARIO GENERAL",
        "Almacén y existencias por proyecto",
        usuario
    );

    y = agregarResumen(doc, autoTable, almacen, proyectos, y);
    y = agregarSeccion(doc, autoTable, "ALMACÉN GENERAL", almacen, y);

    for (const proyecto of proyectos) {
        y = agregarSeccion(
            doc,
            autoTable,
            `PROYECTO: ${nombreProyecto(proyecto)}`,
            proyecto.inventarios || [],
            y
        );
    }

    agregarPie(doc);

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
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    doc.setProperties({
        title: `Inventario del proyecto ${proyecto?.nombre || ""}`.trim(),
        subject: "Inventario por proyecto",
        author: "Sistema de Almacén",
        creator: "Sistema de Almacén",
    });

    let y = dibujarEncabezado(
        doc,
        "INVENTARIO DEL PROYECTO",
        proyecto?.nombre ? `Proyecto: ${proyecto.nombre}` : "",
        usuario
    );

    y = agregarSeccion(
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

    agregarPie(doc);

    return doc;
}

export async function exportarInventarioProyectoPdf(datos = {}) {
    const doc = await crearPdfInventarioProyecto(datos);
    doc.save(
        `inventario-proyecto-${slugArchivo(datos.proyecto?.nombre)}-${fechaArchivo()}.pdf`
    );
}
