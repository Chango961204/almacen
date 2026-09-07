import { useEffect, useState } from "react";
import { getDevoluciones, crearDevolucion } from "../services/devolucionService";
import { getSalidas } from "../services/salidaService";
import PageHeader from "../components/PageHeader";
import Table from "../components/Table";
import DevolucionModal from "../components/DevolucionModal";

function formatearFecha(iso) {
    if (!iso) return "-";
    const [anio, mes, dia] = iso.slice(0, 10).split("-");
    return `${dia}/${mes}/${anio}`;
}

export default function Devoluciones() {
    const [devoluciones, setDevoluciones] = useState([]);
    const [salidas, setSalidas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);

    async function cargarDevoluciones() {
        setLoading(true);
        setError("");
        try {
            const data = await getDevoluciones();
            setDevoluciones(data);
        } catch {
            setError("No se pudieron cargar las devoluciones");
        } finally {
            setLoading(false);
        }
    }

    async function cargarSalidas() {
        try {
            const data = await getSalidas();
            setSalidas(data);
        } catch {
            setSalidas([]);
        }
    }

    useEffect(() => {
        cargarDevoluciones();
        cargarSalidas();
        // eslint-disable-next-line
    }, []);

    async function handleSave(datos) {
        try {
            await crearDevolucion(datos);
            setModalAbierto(false);
            cargarDevoluciones();
            cargarSalidas(); // las cantidades disponibles cambiaron
        } catch (error) {
            setError(error.response?.data?.message || "No se pudo registrar la devolución");
        }
    }

    const columns = [
        { key: "id", label: "#", render: (fila) => fila.id },
        { key: "folio", label: "Folio" },
        { key: "fecha", label: "Fecha", render: (fila) => formatearFecha(fila.fecha) },
        { key: "salida", label: "Salida", render: (fila) => fila.salida?.folio || "-" },
        { key: "proyecto", label: "Proyecto", render: (fila) => fila.salida?.proyecto?.nombre || "-" },
        { key: "motivo", label: "Motivo", render: (fila) => fila.motivo || "-" },
        { key: "articulos", label: "Artículos", render: (fila) => `${fila.detalles?.length || 0} renglón(es)` },
        { key: "creado", label: "Registró", render: (fila) => fila.creadoPor?.nombre || "-" },
    ];

    return (
        <div>
            <PageHeader title="Devoluciones" subtitle="Registra devoluciones de material de salidas" onAdd={() => setModalAbierto(true)} addLabel="Nueva Devolución" />

            {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <Table
                columns={columns}
                rows={devoluciones}
                loading={loading}
                emptyMessage="No hay devoluciones registradas"
            />

            <DevolucionModal
                open={modalAbierto}
                onClose={() => setModalAbierto(false)}
                onSave={handleSave}
                salidas={salidas}
            />
        </div>
    );
}