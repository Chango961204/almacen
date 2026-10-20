import {
    BORDE,
    FONDO_SUAVE,
    GRIS,
    OSCURO,
    ROJO,
    VERDE,
} from "./constantes.js";
import { asegurarEspacio } from "./layout.js";
import {
    fechaHora,
    fechaReporte,
    fechaSola,
    nombreProyecto,
    texto,
} from "./formato.js";

export function agregarDatosProyecto(
    doc,
    autoTable,
    proyecto,
    usuario,
    y,
    margen
) {
    const estado = proyecto.activo ? "Activo" : "Inactivo";
    const generadoPor = usuario?.nombre
        ? `${usuario.nombre}${usuario.rol ? ` (${usuario.rol})` : ""}`
        : "—";

    const etiqueta = (contenido) => ({
        content: contenido,
        styles: {
            fontStyle: "bold",
            fillColor: FONDO_SUAVE,
        },
    });

    const cuerpo = [
        [
            etiqueta("Proyecto"),
            `${nombreProyecto(proyecto)} (#${proyecto.id})`,
            etiqueta("Estado"),
            {
                content: estado,
                styles: {
                    fontStyle: "bold",
                    textColor: proyecto.activo ? VERDE : ROJO,
                },
            },
        ],
        [
            etiqueta("Creado en el sistema"),
            fechaHora(proyecto.creadoEn),
            etiqueta("Última actualización"),
            fechaHora(proyecto.actualizadoEn),
        ],
        [
            etiqueta("Fecha de inicio"),
            fechaSola(proyecto.fechaInicio),
            etiqueta("Fecha de fin"),
            fechaSola(proyecto.fechaFin),
        ],
        [
            etiqueta("Generado por"),
            generadoPor,
            etiqueta("Generado el"),
            fechaReporte(),
        ],
        [
            etiqueta("Descripción"),
            {
                content: texto(proyecto.descripcion),
                colSpan: 3,
            },
        ],
    ];

    const inicio = asegurarEspacio(doc, y, 48);

    autoTable(doc, {
        startY: inicio,
        body: cuerpo,
        theme: "grid",
        margin: {
            left: margen,
            right: margen,
            top: 20,
            bottom: 16,
        },
        styles: {
            font: "helvetica",
            fontSize: 8,
            cellPadding: 2,
            textColor: OSCURO,
            lineColor: BORDE,
            lineWidth: 0.1,
            overflow: "linebreak",
            valign: "top",
        },
        columnStyles: {
            0: { cellWidth: 38 },
            2: { cellWidth: 38 },
        },
    });

    return (doc.lastAutoTable?.finalY || inicio) + 8;
}

export function agregarResumenProyecto(
    doc,
    autoTable,
    totales,
    rangoMovimientos,
    y,
    margen
) {
    const etiqueta = (contenido) => ({
        content: contenido,
        styles: {
            fontStyle: "bold",
            fillColor: FONDO_SUAVE,
        },
    });

    const cuerpo = [
        [
            etiqueta("Artículos con existencia"),
            String(totales?.articulosConExistencia ?? 0),
            etiqueta("Entradas registradas"),
            String(totales?.entradas ?? 0),
        ],
        [
            etiqueta("Salidas registradas"),
            String(totales?.salidas ?? 0),
            etiqueta("Devoluciones registradas"),
            String(totales?.devoluciones ?? 0),
        ],
        [
            etiqueta("Rango de movimientos"),
            {
                content: rangoMovimientos,
                colSpan: 3,
            },
        ],
    ];

    let inicio = asegurarEspacio(doc, y, 30);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...OSCURO);
    doc.text("RESUMEN DEL PROYECTO", margen, inicio);

    inicio += 3;

    autoTable(doc, {
        startY: inicio,
        body: cuerpo,
        theme: "grid",
        margin: {
            left: margen,
            right: margen,
            top: 20,
            bottom: 16,
        },
        styles: {
            font: "helvetica",
            fontSize: 8,
            cellPadding: 2,
            textColor: OSCURO,
            lineColor: BORDE,
            lineWidth: 0.1,
            overflow: "linebreak",
            valign: "top",
        },
        columnStyles: {
            0: { cellWidth: 48 },
            2: { cellWidth: 48 },
        },
    });

    return (doc.lastAutoTable?.finalY || inicio) + 8;
}

export function agregarActaEntrega(doc, proyecto, y, margen) {
    const inicio = asegurarEspacio(doc, y, 60);
    const ancho = doc.internal.pageSize.getWidth();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...OSCURO);
    doc.text("ACTA DE ENTREGA", margen, inicio);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...OSCURO);

    const parrafo =
        `Se hace constar la entrega del proyecto "${texto(
            proyecto?.nombre,
            "Proyecto"
        )}" y del inventario detallado en este reporte, así como el ` +
        "historial de entradas, salidas y devoluciones registrado en el Sistema de Almacén.";

    const lineas = doc.splitTextToSize(
        parrafo,
        ancho - margen * 2
    );

    doc.text(lineas, margen, inicio + 6);

    const inicioBloques = inicio + 6 + lineas.length * 4 + 8;
    const anchoBloque = (ancho - margen * 2 - 12) / 2;

    const bloques = [
        {
            x: margen,
            titulo: "ENTREGA",
        },
        {
            x: margen + anchoBloque + 12,
            titulo: "RECIBE",
        },
    ];

    bloques.forEach((bloque) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...OSCURO);
        doc.text(bloque.titulo, bloque.x, inicioBloques);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...GRIS);

        let yBloque = inicioBloques + 10;

        ["Nombre:", "Cargo:", "Firma:", "Fecha:"].forEach((etiqueta) => {
            doc.text(etiqueta, bloque.x, yBloque);
            doc.setDrawColor(...BORDE);
            doc.line(
                bloque.x + 16,
                yBloque + 1,
                bloque.x + anchoBloque,
                yBloque + 1
            );
            yBloque += 11;
        });
    });

    return inicioBloques + 55;
}
