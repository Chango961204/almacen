import { useEffect, useState } from "react";
import { getSalidas, crearSalida } from "../services/salidaService";
import { getProyectos } from "../services/proyectoService";
import { getArticulos } from "../services/articuloService";
import PageHeader from "../components/PageHeader";
import Table from "../components/Table";
import SalidaModal from "../components/SalidaModal";

function formatearFecha(iso) {
    if (!iso) return "-";
    const [anio, mes, dia] = iso.slice(0, 10).split("-");
    return `${dia}/${mes}/${anio}`;
}

export default function Salidas() {
    const [salidas, setSalidas] = useState([]);
    const [proyectos, setProyectos] = useState([]);
    const [articulos, setArticulos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);

    async function cargarSalidas() {
        setLoading(true);
        setError("");
        try {
            const data = await getSalidas();
            setSalidas(data);
        } catch {
            setError("No se pudieron cargar las salidas");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        cargarSalidas();
        getProyectos().then(setProyectos).catch(() => setProyectos([]));
        getArticulos().then(setArticulos).catch(() => setArticulos([]));
        // eslint-disable-next-line
    }, []);

    async function handleSave(datos) {
        try {
            await crearSalida(datos);
            setModalAbierto(false);
            cargarSalidas();
        } catch (error) {
            setError(error.response?.data?.message || "No se pudo registrar la salida");
        }
    }

    const columns = [
        { key: "id", label: "#", render: (fila) => fila.id },
        { key: "folio", label: "Folio" },
        { key: "fecha", label: "Fecha", render: (fila) => formatearFecha(fila.fecha) },
        { key: "proyecto", label: "Proyecto", render: (fila) => fila.proyecto?.nombre || "-" },
        { key: "responsable", label: "Responsable", render: (fila) => fila.responsable || "-" },
        { key: "articulos", label: "Artículos", render: (fila) => `${fila.detalles?.length || 0} renglón(es)` },
        { key: "creado", label: "Registró", render: (fila) => fila.creadoPor?.nombre || "-" },
    ];

    return (
        <div>
            <PageHeader title="Salidas" subtitle="Registra las salidas de material a proyectos" onAdd={() => setModalAbierto(true)} addLabel="Nueva Salida" />

            {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <Table
                columns={columns}
                rows={salidas}
                loading={loading}
                emptyMessage="No hay salidas registradas"
            />

            <SalidaModal
                open={modalAbierto}
                onClose={() => setModalAbierto(false)}
                onSave={handleSave}
                proyectos={proyectos}
                articulos={articulos}
            />
        </div>
    );
}