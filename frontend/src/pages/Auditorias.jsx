import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { getAuditorias } from "../services/auditoriaService";
import PageHeader from "../components/PageHeader";
import Table from "../components/Table";
import Badge from "../components/Badge";

const coloresAccion = {
    CREAR: "green",
    ACTUALIZAR: "blue",
    ELIMINAR: "red",
};

const entidades = ["ENTRADA", "SALIDA", "DEVOLUCION", "USUARIO"];
const acciones = ["CREAR", "ACTUALIZAR", "ELIMINAR"];

function formatearFechaHora(iso) {
    if (!iso) return "-";
    return format(parseISO(iso), "dd/MM/yyyy HH:mm");
}

export default function Auditorias() {
    const [auditorias, setAuditorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [filtros, setFiltros] = useState({
        entidad: "",
        accion: "",
        desde: "",
        hasta: "",
    });

    // IMPORTANTE: recibe los filtros como parámetro (no los lee del estado)
    // para evitar errores de estado "viejo" (stale closure).
    async function cargarAuditorias(parametros = filtros) {
        setLoading(true);
        setError("");
        try {
            const data = await getAuditorias(parametros);
            setAuditorias(data);
        } catch {
            setError("No se pudieron cargar las auditorías");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        cargarAuditorias();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function aplicarFiltros(e) {
        e.preventDefault();
        cargarAuditorias();
    }

    function limpiarFiltros() {
        const vacios = { entidad: "", accion: "", desde: "", hasta: "" };
        setFiltros(vacios);
        cargarAuditorias(vacios);
    }

    const columns = [
        { key: "id", label: "#", render: (fila) => fila.id },
        { key: "fecha", label: "Fecha y hora", render: (fila) => formatearFechaHora(fila.creadoEn) },
        { key: "usuario", label: "Usuario", render: (fila) => fila.usuario?.nombre || "-" },
        { key: "accion", label: "Acción", render: (fila) => <Badge tone={coloresAccion[fila.accion] || "gray"}>{fila.accion}</Badge> },
        { key: "entidad", label: "Entidad", render: (fila) => <Badge tone="blue">{fila.entidad}</Badge> },
        { key: "entidadId", label: "Registro", render: (fila) => fila.entidadId || "-" },
        { key: "descripcion", label: "Descripción", render: (fila) => fila.descripcion || "-" },
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader title="Auditorías" subtitle="Registro detallado de las acciones del sistema" />

            <form onSubmit={aplicarFiltros} className="mb-4 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
                <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Entidad</label>
                    <select value={filtros.entidad} onChange={(e) => setFiltros({ ...filtros, entidad: e.target.value })} className="input-base py-2">
                        <option value="">Todas</option>
                        {entidades.map((entidad) => (
                            <option key={entidad} value={entidad}>{entidad}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Acción</label>
                    <select value={filtros.accion} onChange={(e) => setFiltros({ ...filtros, accion: e.target.value })} className="input-base py-2">
                        <option value="">Todas</option>
                        {acciones.map((accion) => (
                            <option key={accion} value={accion}>{accion}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Desde</label>
                    <input type="date" value={filtros.desde} onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })} className="input-base py-2" />
                </div>

                <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Hasta</label>
                    <input type="date" value={filtros.hasta} onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })} className="input-base py-2" />
                </div>

                <div className="flex items-end gap-2">
                    <button type="submit" className="btn btn-primary flex-1">Filtrar</button>
                    <button type="button" onClick={limpiarFiltros} className="btn btn-secondary">Limpiar</button>
                </div>
            </form>

            {error && <div className="animate-slide-down mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-100">{error}</div>}

            <Table
                columns={columns}
                rows={auditorias}
                loading={loading}
                emptyMessage="No hay registros de auditoría"
            />
        </div>
    );
}