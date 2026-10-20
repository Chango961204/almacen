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

export function fechaArchivo() {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}

export function fechaReporte() {
    return new Date().toLocaleString("es-MX", {
        dateStyle: "short",
        timeStyle: "short",
    });
}

export function fechaSola(iso) {
    if (iso instanceof Date) {
        if (Number.isNaN(iso.getTime())) return "—";

        return fechaSola(iso.toISOString());
    }

    const textoFecha = String(iso || "");

    if (!textoFecha) return "—";

    const [anio, mes, dia] = textoFecha.slice(0, 10).split("-");

    if (!anio || !mes || !dia) return "—";

    return `${dia}/${mes}/${anio}`;
}

export function fechaHora(iso) {
    if (!iso) return "—";

    const fecha = new Date(iso);

    if (Number.isNaN(fecha.getTime())) return "—";

    return fecha.toLocaleString("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

export function texto(valor, reemplazo = "—") {
    const limpio = String(valor ?? "").trim();
    return limpio || reemplazo;
}

export function nombreProyecto(proyecto) {
    const nombre = texto(proyecto?.nombre, "Proyecto");
    return proyecto?.activo === false ? `${nombre} (inactivo)` : nombre;
}

export function etiquetaProyecto(proyecto) {
    const id = proyecto?.id ? ` (#${proyecto.id})` : "";
    return `${nombreProyecto(proyecto)}${id}`;
}

export function nombreArticulo(articulo) {
    const nombre = texto(articulo?.nombre, "Artículo");
    return articulo?.activo === false ? `${nombre} (inactivo)` : nombre;
}

export function codigoArticulo(articulo) {
    return texto(articulo?.codigo);
}

export function marcaArticulo(articulo) {
    return texto(articulo?.marca?.nombre);
}

export function unidadArticulo(articulo) {
    return texto(articulo?.unidadMedida?.simbolo);
}

export function descripcionArticulo(articulo) {
    const codigo = codigoArticulo(articulo);
    const nombre = nombreArticulo(articulo);
    const primeraLinea =
        codigo === "—" ? nombre : `${codigo} — ${nombre}`;

    return `${primeraLinea}\nMarca: ${marcaArticulo(articulo)}`;
}

export function cantidadConUnidad(cantidad, articulo) {
    return `${formatearCantidad(cantidad)} ${unidadArticulo(articulo)}`;
}

export function filaPdf(fila) {
    return [
        fila.articulo?.codigo || "—",
        nombreArticulo(fila.articulo),
        fila.articulo?.marca?.nombre || "—",
        fila.articulo?.unidadMedida?.simbolo || "—",
        formatearCantidad(fila.cantidadActual),
    ];
}

export function totalExistencia(filas) {
    return filas.reduce(
        (total, fila) => total + Number(fila.cantidadActual || 0),
        0
    );
}

export function calcularRangoMovimientos(entradas, salidas, devoluciones) {
    const fechas = [
        ...entradas.map((movimiento) => movimiento.fechaRecepcion),
        ...salidas.map((movimiento) => movimiento.fecha),
        ...devoluciones.map((movimiento) => movimiento.fecha),
    ]
        .filter(Boolean)
        .map((valor) => ({
            original: valor,
            tiempo: new Date(valor).getTime(),
        }))
        .filter((fecha) => Number.isFinite(fecha.tiempo))
        .sort((a, b) => a.tiempo - b.tiempo);

    if (!fechas.length) return "Sin movimientos registrados";

    return `${fechaSola(fechas[0].original)} a ${fechaSola(
        fechas[fechas.length - 1].original
    )}`;
}
