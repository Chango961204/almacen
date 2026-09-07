import { useEffect, useState } from "react";
import { getEntradas, crearEntrada } from "../services/entradaService";
import { getProyectos } from "../services/proyectoService";
import { getArticulos } from "../services/articuloService";
import PageHeader from "../components/PageHeader";
import Table from "../components/Table";
import EntradaModal from "../components/EntradaModal";

function formatearFecha(iso) {
    if (!iso) return "-";
    const [anio, mes, dia] = iso.slice(0, 10).split("-");
    return `${dia}/${mes}/${anio}`;
}

export default function Entradas() {
    const [entradas, setEntradas] = useState([]);
    const [proyectos, setProyectos] = useState([]);
    const [articulos, setArticulos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);

    async function cargarEntradas() {
        setLoading(true);
        setError("");
        try {
            const data = await getEntradas();
            setEntradas(data);
        } catch {
            setError("No se pudieron cargar las entradas");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        cargarEntradas();
        getProyectos().then(setProyectos).catch(() => setProyectos([]));
        getArticulos().then(setArticulos).catch(() => setArticulos([]));
    }, []);

    async function handleSave(datos) {
        try {
            await crearEntrada(datos);
            setModalAbierto(false);
            cargarEntradas();
        } catch {
            setError("No se pudo registrar la entrada");
        }
    }

    const contarDetalles = (entrada) => entrada.detalles?.length || 0;

    const columns = [
        { key: "id", label: "#", render: (fila) => fila.id },
        { key: "fecha", label: "Fecha", render: (fila) => formatearFecha(fila.fechaRecepcion) },
        { key: "factura", label: "Factura", render: (fila) => fila.folioFactura || "-" },
        { key: "requisicion", label: "Requisición", render: (fila) => fila.folioRequisicion || "-" },
        { key: "proveedor", label: "Proveedor", render: (fila) => fila.proveedor || "-" },
        { key: "articulos", label: "Artículos", render: (fila) => `${contarDetalles(fila)} renglón(es)` },
        { key: "creado", label: "Registró", render: (fila) => fila.creadoPor?.nombre || "-" },
    ];

    return (
        <div>
            <PageHeader title="Entradas" subtitle="Registra y consulta entradas al almacén" onAdd={() => setModalAbierto(true)} addLabel="Nueva Entrada" />

            {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <Table
                columns={columns}
                rows={entradas}
                loading={loading}
                emptyMessage="No hay entradas registradas"
            />

            <EntradaModal
                open={modalAbierto}
                onClose={() => setModalAbierto(false)}
                onSave={handleSave}
                proyectos={proyectos}
                articulos={articulos}
            />
        </div>
    );
}