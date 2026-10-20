import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
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
    const { usuario } = useAuth();
    // Solo el SUPER_ADMIN puede eliminar; el ADMIN crea, ve y edita.
    const puedeEliminar = usuario?.rol === "SUPER_ADMIN";

    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [modalAbierto, setModalAbierto] = useState(false);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

    const [confirmarBorrar, setConfirmarBorrar] = useState(null);
    const [borrando, setBorrando] = useState(false);

    // Por defecto solo se muestran los proyectos activos. Los eliminados
    // conservan su nombre para el historial, pero no ensucian la vista.
    const [mostrarInactivos, setMostrarInactivos] = useState(false);

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
                toast.success("Proyecto actualizado correctamente");
            } else {
                await crearProyecto(datos);
                toast.success("Proyecto creado correctamente");
            }
            setModalAbierto(false);
            cargarProyectos();
        } catch (error) {
            toast.error(error.response?.data?.message || "No se pudo guardar el proyecto");
        }
    }

    async function handleEliminar() {
        setBorrando(true);
        try {
            await eliminarProyecto(confirmarBorrar.id);
            setConfirmarBorrar(null);
            toast.success("Proyecto eliminado");
            cargarProyectos();
        } catch (error) {
            toast.error(error.response?.data?.message || "No se pudo eliminar el proyecto");
        } finally {
            setBorrando(false);
        }
    }

    const proyectosVisibles = mostrarInactivos
        ? proyectos
        : proyectos.filter((proyecto) => proyecto.activo);

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

            {error && <div className="alert-error">{error}</div>}

            <div className="mb-4 flex items-center justify-end">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                    <input
                        type="checkbox"
                        checked={mostrarInactivos}
                        onChange={(e) => setMostrarInactivos(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300"
                    />
                    Mostrar inactivos
                </label>
            </div>

            <Table
                columns={columns}
                rows={proyectosVisibles}
                loading={loading}
                emptyMessage={mostrarInactivos ? "No hay proyectos registrados" : "No hay proyectos activos"}
                actions={(fila) => (
                    <>
                        <button onClick={() => abrirEditar(fila)} className="btn-icon" title="Editar">
                            <Pencil className="h-4 w-4" />
                        </button>
                        {puedeEliminar && (
                            <button onClick={() => setConfirmarBorrar(fila)} className="btn-icon btn-icon-danger" title="Eliminar">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
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
                message={`¿Seguro que deseas eliminar "${confirmarBorrar?.nombre}"? Dejará de mostrarse en los desplegables; su historial de movimientos se conserva.`}
            />
        </div>
    );
}
