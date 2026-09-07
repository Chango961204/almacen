import { useEffect, useState } from "react";
import { getInventarioAlmacen, getInventarioProyecto } from "../services/inventarioService.js";
import { getProyectos } from "../services/proyectoService.js";
import { Warehouse, FolderKanban } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import Table from "../components/Table.jsx";
import Badge from "../components/Badge.jsx";

export default function Inventario() {
    const [vista, setVista] = useState("almacen");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [inventario, setInventario] = useState([]);


    const [proyectos, setProyectos] = useState([]);
    const [proyectoId, setProyectoId] = useState("");

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

    return (
        <div className="animate-fade-in">
            <PageHeader title="Inventario" subtitle="Consulta las existencias del almacén y por proyecto" />
            <div className="mb-6 inline-flex rounded-xl bg-slate-100 p-1">
                <button onClick={() => setVista("almacen")} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${vista === "almacen" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
                    <Warehouse className="h-4 w-4" />
                    Almacén
                </button>

                <button onClick={() => setVista("proyecto")} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${vista === "proyecto" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
                    <FolderKanban className="h-4 w-4" />
                    Por Proyecto
                </button>

            </div>

            {vista === "proyecto" && (
                <div className="mb-4 flex max-w-md items-center gap-3 animate-slide-down">
                    <label className="text-sm font-medium text-slate-700">Proyecto</label>
                    <select value={proyectoId} onChange={(e) => setProyectoId(e.target.value)} className="input-base">
                        <option value="">Selecciona un proyecto</option>
                        {proyectos.map((p) => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                    </select>
                </div>
            )}

            {error && <div className="animate-slide-down mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-100">{error}</div>}

            <Table
                columns={columns}
                rows={inventario}
                loading={loading}
                emptyMessage={vista === "almacen" ? "No hay existencias en el almacén" : "Selecciona un proyecto para ver sus existencias"}
            />

        </div>
    );

}