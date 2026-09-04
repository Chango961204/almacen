import { useEffect, useState } from "react";
import { getInventarioAlmacen, getInventarioProyecto } from "../services/inventarioService.js";
import { getProyecto, getProyectos } from "../services/proyectoService.js";
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

        } catch (err) {
            setError("No se pudo cargar el inventario");

        } finally {
            setLoading(false);
        }
    }

    const columns = [
        { key: "articulo", label: "Artículo", render: (fila) => fila.articulo?.nombre },

        { key: "categoria", label: "Categoría", render: (fila) => (<span className="text-xs text-slate-500">{fila.articulo?.marca?.nombre || "-"}</span>) },

        { key: "cantidad", label: "Cantidad", render: (fila) => (<Badge tone="green">{Number(fila.cantidadActual)}</Badge>) },

        { key: "unidad", label: "Unidad", render: (fila) => fila.articulo?.unidadMedida?.simbolo || "-" },
    ];

    useEffect(() => {
        getProyectos().then((p) => setProyectos(p)).catch(() => setProyectos([]));
    }, []);

    useEffect(() => {
        if (vista === "proyecto" && !proyectoId) return;
        cargarDatos();

    }, [vista, proyectoId]);

    return (
        <div>
            <PageHeader title="Inventario" subtitle="Consulta las existencias del almacén y por proyecto" />
            <div className="mb-6 flex gap-2">
                <button onClick={() => setVista("almacen")} className={`rounded-lg px-4 py-2 text-sm font-semibold ${vista === "almacen" ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-300"}`}>
                    Almacén
                </button>

                <button onClick={() => setVista("proyecto")} className={`rounded-lg px-4 py-2 text-sm font-semibold ${vista === "proyecto" ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-300"}`}>
                    Por Proyecto
                </button>

            </div>

            {vista === "proyecto" && (
                <div className="mb-4 flex items-center gap-3">
                    <label className="text-sm font-medium text-slate-700">Proyecto</label>
                    <select value={proyectoId} onChange={(e) => setProyectoId(e.target.value)} className="rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500">
                        <option value="">Selecciona un proyecto</option>
                        {proyectos.map((p) => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                    </select>
                </div>
            )}

            {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <Table
                columns={columns}
                rows={inventario}
                loading={loading}
                emptyMessage={vista == "almacen" ? "No hay existencias en el almacén" : "No hay existencias para este proyecto"}
            />

        </div>
    );

}
