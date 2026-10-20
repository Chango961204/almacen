import { useEffect, useState } from "react";
import { getInventarioAlmacen, getInventarioGeneral, getInventarioProyecto, getReporteProyecto } from "../services/inventarioService.js";
import { getProyectos } from "../services/proyectoService.js";
import { Warehouse, FolderKanban, FileDown } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader.jsx";
import Table from "../components/Table.jsx";
import Badge from "../components/Badge.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { exportarInventarioGeneralPdf, exportarInventarioProyectoPdf, exportarReporteProyectoPdf } from "../utils/pdf/index.js";

function formatearFechaCorta(iso) {
    if (!iso) return "—";

    const [anio, mes, dia] = String(iso).slice(0, 10).split("-");

    if (!anio || !mes || !dia) return "—";

    return `${dia}/${mes}/${anio}`;
}

export default function Inventario() {
    const { usuario } = useAuth();
    const puedeVerHistorial =
        usuario?.rol === "SUPER_ADMIN" || usuario?.rol === "ADMIN";

    const [vista, setVista] = useState("almacen");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [inventario, setInventario] = useState([]);


    const [proyectos, setProyectos] = useState([]);
    const [proyectoId, setProyectoId] = useState("");
    const [mostrarInactivos, setMostrarInactivos] = useState(false);

    const [generando, setGenerando] = useState(null);

    async function cargarDatos() {
        setLoading(true);
        setError("");

        try {
            let data;
            if (vista === "almacen") {
                data = await getInventarioAlmacen();
            } else {
                data = await getInventarioProyecto(proyectoId);
            }
            setInventario(data);

        } catch (error) {
            setError(error.response?.data?.message || "No se pudo cargar el inventario");

        } finally {
            setLoading(false);
        }
    }

    async function exportarGeneralPdf() {
        setGenerando("general");

        try {
            const datos = await getInventarioGeneral();

            await exportarInventarioGeneralPdf({ ...datos, usuario });

            toast.success("PDF general generado");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "No se pudo generar el PDF general");
        } finally {
            setGenerando(null);
        }
    }

    async function exportarProyectoPdf() {
        const proyecto = proyectos.find((p) => String(p.id) === String(proyectoId));

        if (!proyecto) {
            toast.error("Selecciona un proyecto");
            return;
        }

        setGenerando("proyecto");

        try {
            if (puedeVerHistorial) {
                const reporte = await getReporteProyecto(proyecto.id);

                await exportarReporteProyectoPdf({ reporte, usuario });

                toast.success("Reporte del proyecto generado");
            } else {
                await exportarInventarioProyectoPdf({ proyecto, filas: inventario, usuario });

                toast.success("PDF del proyecto generado");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "No se pudo generar el PDF del proyecto");
        } finally {
            setGenerando(null);
        }
    }

    function handleMostrarInactivos(event) {
        const checked = event.target.checked;

        setMostrarInactivos(checked);

        if (!checked) {
            const seleccionado = proyectos.find(
                (proyecto) => String(proyecto.id) === String(proyectoId)
            );

            if (seleccionado && !seleccionado.activo) {
                setProyectoId("");
            }
        }
    }

    const columns = [
        { key: "articulo", label: "Artículo", render: (fila) => fila.articulo?.nombre },

        { key: "categoria", label: "Categoría", render: (fila) => (<span className="text-xs text-slate-500">{fila.articulo?.marca?.nombre || "-"}</span>) },

        { key: "cantidad", label: "Cantidad", render: (fila) => (<Badge tone="blue">{Number(fila.cantidadActual)}</Badge>) },

        { key: "unidad", label: "Unidad", render: (fila) => fila.articulo?.unidadMedida?.simbolo || "-" },
    ];

    useEffect(() => {
        getProyectos().then((p) => setProyectos(p)).catch(() => setProyectos([]));
    }, []);

    useEffect(() => {
        if (vista === "proyecto" && !proyectoId) {
            setInventario([]);
            setLoading(false);
            return;
        }
        cargarDatos();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vista, proyectoId]);

    const proyectoSeleccionado = proyectos.find((p) => String(p.id) === String(proyectoId));
    const proyectosVisibles = proyectos.filter(
        (proyecto) => proyecto.activo || mostrarInactivos
    );

    return (
        <div className="animate-fade-in">
            <PageHeader title="Inventario" subtitle="Consulta las existencias del almacén y por proyecto" />
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex rounded-full border border-white/60 bg-white/40 p-1.5 backdrop-blur-xl">
                    <button onClick={() => setVista("almacen")} className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${vista === "almacen" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>
                        <Warehouse className="h-4 w-4" />
                        Almacén
                    </button>

                    <button onClick={() => setVista("proyecto")} className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${vista === "proyecto" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>
                        <FolderKanban className="h-4 w-4" />
                        Por Proyecto
                    </button>

                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={exportarGeneralPdf}
                        disabled={generando !== null}
                        className="btn btn-secondary"
                    >
                        <FileDown className={`h-4 w-4 ${generando === "general" ? "animate-pulse" : ""}`} />
                        {generando === "general" ? "Generando…" : "PDF general (resumen)"}
                    </button>

                    {vista === "proyecto" && (
                        <button
                            type="button"
                            onClick={exportarProyectoPdf}
                            disabled={!proyectoSeleccionado || generando !== null}
                            className="btn btn-secondary"
                        >
                            <FileDown className={`h-4 w-4 ${generando === "proyecto" ? "animate-pulse" : ""}`} />
                            {generando === "proyecto"
                                ? "Generando…"
                                : puedeVerHistorial
                                    ? "PDF del proyecto (historial)"
                                    : "PDF del proyecto"}
                        </button>
                    )}
                </div>
            </div>

            {vista === "proyecto" && (
                <div className="mb-4 flex max-w-4xl flex-col gap-3 animate-slide-down sm:flex-row sm:items-center">
                    <label className="text-sm font-medium text-slate-700">Proyecto</label>
                    <select value={proyectoId} onChange={(e) => setProyectoId(e.target.value)} className="input-base flex-1">
                        <option value="">Selecciona un proyecto</option>
                        {proyectosVisibles.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre} · #{p.id} · {p.activo ? "Activo" : "Inactivo"} · creado {formatearFechaCorta(p.creadoEn)}
                            </option>
                        ))}
                    </select>
                    <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm text-slate-600">
                        <input
                            type="checkbox"
                            checked={mostrarInactivos}
                            onChange={handleMostrarInactivos}
                            className="h-4 w-4 rounded border-slate-300"
                        />
                        Mostrar inactivos
                    </label>
                </div>
            )}

            {puedeVerHistorial && vista === "proyecto" && (
                <p className="mb-4 text-xs text-slate-500">
                    El PDF del proyecto incluye datos de creación, inventario actual, entradas, salidas, devoluciones y acta de entrega.
                </p>
            )}

            {error && <div className="alert-error">{error}</div>}

            <Table
                columns={columns}
                rows={inventario}
                loading={loading}
                emptyMessage={vista === "almacen" ? "No hay existencias en el almacén" : "Selecciona un proyecto para ver sus existencias"}
            />

        </div>
    );

}
