import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { getProyectos, crearProyecto, actualizarProyecto, eliminarProyecto } from "../services/proyectoService";
import PageHeader from "../components/PageHeader";
import Table from "../components/Table";
import Badge from "../components/Badge";
import ProyectoModal from "../components/ProyectoModal";
import ConfirmDialog from "../components/ConfirmDialog";

function formatearFecha(iso) {
    if (!iso) return "-";
    const [anio, mes, dia] = iso.slice(0, 10).split("-");
    return `${dia}/${mes}/${anio}`;
}

export default function Proyectos() {
    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [modalAbierto, setModalAbierto] = useState(false);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

    const [confirmarBorrar, setConfirmarBorrar] = useState(null);
    const [borrando, setBorrando] = useState(false);

    async function cargarProyectos() {
        setLoading(true);
        setError("");
        try {
            const data = await getProyectos();
            setProyectos(data);
        } catch {
            setError("No se pudieron cargar los proyectos");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        cargarProyectos();
        // eslint-disable-next-line
    }, []);

    function abrirCrear() {
        setProyectoSeleccionado(null);
        setModalAbierto(true);
    }

    function abrirEditar(proyecto) {
        setProyectoSeleccionado(proyecto);
        setModalAbierto(true);
    }

    async function handleSave(datos) {
        try {
            if (proyectoSeleccionado) {
                await actualizarProyecto(proyectoSeleccionado.id, datos);
            } else {
                await crearProyecto(datos);
            }
            setModalAbierto(false);
            cargarProyectos();
        } catch {
            setError("No se pudo guardar el proyecto");
        }
    }

    async function handleEliminar() {
        setBorrando(true);
        try {
            await eliminarProyecto(confirmarBorrar.id);
            setConfirmarBorrar(null);
            cargarProyectos();
        } catch {
            setError("No se pudo eliminar el proyecto");
        } finally {
            setBorrando(false);
        }
    }

    const columns = [
        { key: "nombre", label: "Proyecto" },
        { key: "descripcion", label: "Descripción", render: (fila) => fila.descripcion || "-" },
        { key: "inicio", label: "Inicio", render: (fila) => formatearFecha(fila.fechaInicio) },
        { key: "fin", label: "Fin", render: (fila) => formatearFecha(fila.fechaFin) },
        {
            key: "estado", label: "Estado", render: (fila) => (
                <Badge tone={fila.activo ? "green" : "red"}>{fila.activo ? "Activo" : "Inactivo"}</Badge>
            )
        },
    ];

    return (
        <div>
            <PageHeader title="Proyectos" subtitle="Gestiona los proyectos" onAdd={abrirCrear} addLabel="Nuevo Proyecto" />

            {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <Table
                columns={columns}
                rows={proyectos}
                loading={loading}
                emptyMessage="No hay proyectos registrados"
                actions={(fila) => (
                    <>
                        <button onClick={() => abrirEditar(fila)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600" title="Editar">
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setConfirmarBorrar(fila)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600" title="Eliminar">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </>
                )}
            />

            <ProyectoModal
                open={modalAbierto}
                onClose={() => setModalAbierto(false)}
                onSave={handleSave}
                proyecto={proyectoSeleccionado}
            />

            <ConfirmDialog
                open={!!confirmarBorrar}
                onClose={() => setConfirmarBorrar(null)}
                onConfirm={handleEliminar}
                loading={borrando}
                title="Eliminar proyecto"
                message={`¿Seguro que deseas eliminar "${confirmarBorrar?.nombre}"?`}
            />
        </div>
    );
}