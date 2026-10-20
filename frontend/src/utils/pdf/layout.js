import {
    AZUL,
    BLANCO,
    BORDE,
    COLUMNAS_EXISTENCIAS,
    FONDO_SUAVE,
    GRIS,
    MARGEN,
    OSCURO,
    ROJO,
} from "./constantes.js";
import { fechaReporte, filaPdf } from "./formato.js";

export async function cargarLibrerias() {
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
    ]);

    return { jsPDF, autoTable };
}

export function dibujarEncabezado(
    doc,
    { titulo, subtitulo, usuario, margen = MARGEN }
) {
    const ancho = doc.internal.pageSize.getWidth();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...AZUL);
    doc.text("SISTEMA DE ALMACÉN", margen, 18);

    doc.setFontSize(16);
    doc.setTextColor(...OSCURO);
    doc.text(titulo, margen, 27);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...GRIS);

    const generado = `Generado: ${fechaReporte()}${
        usuario?.nombre ? ` · Usuario: ${usuario.nombre}` : ""
    }`;

    doc.text(generado, margen, 33);

    let y = 38;

    if (subtitulo) {
        const lineas = doc.splitTextToSize(
            subtitulo,
            ancho - margen * 2
        );

        doc.text(lineas, margen, y);
        y += lineas.length * 4;
    }

    doc.setDrawColor(203, 213, 225);
    doc.line(margen, y + 2, ancho - margen, y + 2);

    return y + 7;
}

export function agregarCabecerasSecundarias(
    doc,
    { etiqueta, detalle, margen = MARGEN }
) {
    const totalPaginas = doc.getNumberOfPages();
    const ancho = doc.internal.pageSize.getWidth();

    for (let pagina = 2; pagina <= totalPaginas; pagina++) {
        doc.setPage(pagina);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...AZUL);
        doc.text(etiqueta || "SISTEMA DE ALMACÉN", margen, 10);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(...GRIS);

        const lineas = doc.splitTextToSize(
            detalle || "",
            ancho - margen * 2 - 75
        );

        doc.text(lineas[0] || "", ancho - margen, 10, {
            align: "right",
        });

        doc.setDrawColor(...BORDE);
        doc.line(margen, 14, ancho - margen, 14);
    }
}

export function agregarPie(doc, { etiqueta, margen = MARGEN }) {
    const totalPaginas = doc.getNumberOfPages();
    const ancho = doc.internal.pageSize.getWidth();
    const alto = doc.internal.pageSize.getHeight();

    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
        doc.setPage(pagina);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(...GRIS);

        const textoPie = etiqueta
            ? `Sistema de Almacén · ${etiqueta}`
            : "Sistema de Almacén";

        const lineas = doc.splitTextToSize(
            textoPie,
            ancho - margen * 2 - 45
        );

        doc.text(lineas[0] || "Sistema de Almacén", margen, alto - 8);
        doc.text(
            `Página ${pagina} de ${totalPaginas}`,
            ancho - margen,
            alto - 8,
            {
                align: "right",
            }
        );
    }
}

export function asegurarEspacio(doc, y, necesario) {
    if (y + necesario > doc.internal.pageSize.getHeight() - 18) {
        doc.addPage();
        return 22;
    }

    return y;
}

export function agregarTabla(
    doc,
    autoTable,
    {
        titulo,
        head,
        body,
        y,
        columnStyles,
        emptyMessage,
        notas = [],
        fontSize = 7,
        margen = MARGEN,
        estadoIndex,
    }
) {
    let inicio = asegurarEspacio(doc, y, 32);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...OSCURO);
    doc.text(titulo, margen, inicio);

    inicio += 3;

    if (!body.length) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(...GRIS);
        doc.text(emptyMessage || "Sin registros", margen, inicio + 4);

        return inicio + 10;
    }

    autoTable(doc, {
        startY: inicio,
        head: [head],
        body,
        theme: "grid",
        showHead: "everyPage",
        rowPageBreak: "avoid",
        margin: {
            left: margen,
            right: margen,
            top: 20,
            bottom: 16,
        },
        styles: {
            font: "helvetica",
            fontSize,
            cellPadding: 1.6,
            textColor: OSCURO,
            lineColor: BORDE,
            lineWidth: 0.1,
            overflow: "linebreak",
            valign: "top",
        },
        headStyles: {
            fillColor: AZUL,
            textColor: BLANCO,
            fontStyle: "bold",
            fontSize,
        },
        alternateRowStyles: {
            fillColor: FONDO_SUAVE,
        },
        columnStyles,
        didParseCell: (data) => {
            if (
                estadoIndex !== undefined &&
                data.section === "body" &&
                data.column.index === estadoIndex &&
                data.cell.raw === "ANULADO"
            ) {
                data.cell.styles.textColor = ROJO;
                data.cell.styles.fontStyle = "bold";
            }
        },
    });

    let fin = (doc.lastAutoTable?.finalY || inicio) + 2;

    if (notas.length) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7);
        doc.setTextColor(...GRIS);

        notas.forEach((nota) => {
            const lineas = doc.splitTextToSize(
                nota,
                doc.internal.pageSize.getWidth() - margen * 2
            );

            doc.text(lineas, margen, fin + 3);
            fin += lineas.length * 3.5 + 1;
        });
    }

    return fin + 6;
}

export function agregarSeccionExistencias(
    doc,
    autoTable,
    titulo,
    filas,
    y,
    { margen = MARGEN, nota, columnStyles } = {}
) {
    return agregarTabla(doc, autoTable, {
        titulo,
        head: COLUMNAS_EXISTENCIAS,
        body: filas.map(filaPdf),
        y,
        emptyMessage: "Sin existencias registradas",
        columnStyles:
            columnStyles || {
                0: { cellWidth: 24 },
                4: { halign: "right", cellWidth: 22 },
            },
        margen,
        notas: nota ? [nota] : [],
    });
}
