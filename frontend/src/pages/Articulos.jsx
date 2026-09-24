import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import { getArticulos, crearArticulo, actualizarArticulo, eliminarArticulo } from "../services/articuloService";
import { getMarcas } from "../services/marcaService";
import { getUnidadesMedida } from "../services/unidadMedidaService";
import PageHeader from "../components/PageHeader";
import Table from "../components/Table";
import Badge from "../components/Badge";
import ArticuloModal from "../components/ArticuloModal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Articulos() {
    const [articulos, setArticulos] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [unidadesMedida, setUnidadesMedida] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [modalAbierto, setModalAbierto] = useState(false);
    const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);

    const [confirmarBorrar, setConfirmarBorrar] = useState(null);
    const [borrando, setBorrando] = useState(false);

    async function cargarArticulos() {
        setLoading(true);
        setError("");
        try {
            const data = await getArticulos();
            setArticulos(data);
        } catch {
            setError("No se pudieron cargar los artículos");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        cargarArticulos();
        getMarcas().then(setMarcas).catch(() => setMarcas([]));
        getUnidadesMedida().then(setUnidadesMedida).catch(() => setUnidadesMedida([]));
    }, []);

    const mapaMarcas = Object.fromEntries(marcas.map((m) => [m.id, m.nombre]));
    const mapaUnidades = Object.fromEntries(unidadesMedida.map((u) => [u.id, u.nombre]));

    function abrirCrear() {
        setArticuloSeleccionado(null);
        setModalAbierto(true);
    }

    function abrirEditar(articulo) {
        setArticuloSeleccionado(articulo);
        setModalAbierto(true);
    }

    async function handleSave(datos) {
        try {
            if (articuloSeleccionado) {
                await actualizarArticulo(articuloSeleccionado.id, datos);
                toast.success("Artículo actualizado correctamente");
            } else {
                await crearArticulo(datos);
                toast.success("Artículo creado correctamente");
            }
            setModalAbierto(false);
            cargarArticulos();
            getMarcas().then(setMarcas).catch(() => setMarcas([]));
            getUnidadesMedida().then(setUnidadesMedida).catch(() => setUnidadesMedida([]));
        } catch (error) {
            toast.error(error.response?.data?.message || "No se pudo guardar el artículo");
        }
    }

    async function handleEliminar() {
        setBorrando(true);
        try {
            await eliminarArticulo(confirmarBorrar.id);
            setConfirmarBorrar(null);
            toast.success("Artículo eliminado");
            cargarArticulos();
        } catch (error) {
            toast.error(error.response?.data?.message || "No se pudo eliminar el artículo");
        } finally {
            setBorrando(false);
        }
    }

    const columns = [
        { key: "nombre", label: "Nombre" },
        { key: "codigo", label: "Código", render: (fila) => fila.codigo || "-" },
        { key: "marca", label: "Marca", render: (fila) => mapaMarcas[fila.marcaId] || "-" },
        { key: "unidad", label: "Unidad", render: (fila) => mapaUnidades[fila.unidadMedidaId] || "-" },
        {
            key: "estado", label: "Estado", render: (fila) => (
                <Badge tone={fila.activo ? "green" : "red"}>{fila.activo ? "Activo" : "Inactivo"}</Badge>
            )
        },
    ];

    return (
        <div>
            <PageHeader title="Artículos" subtitle="Gestiona los artículos del almacén" onAdd={abrirCrear} addLabel="Nuevo Artículo" />

            {error && <div className="alert-error">{error}</div>}

            <Table
                columns={columns}
                rows={articulos}
                loading={loading}
                emptyMessage="No hay artículos registrados"
                actions={(fila) => (
                    <>
                        <button onClick={() => abrirEditar(fila)} className="btn-icon" title="Editar">
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setConfirmarBorrar(fila)} className="btn-icon btn-icon-danger" title="Eliminar">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </>
                )}
            />

            <ArticuloModal
                open={modalAbierto}
                onClose={() => setModalAbierto(false)}
                onSave={handleSave}
                articulo={articuloSeleccionado}
                marcas={marcas}
                unidadesMedida={unidadesMedida}
            />

            <ConfirmDialog
                open={!!confirmarBorrar}
                onClose={() => setConfirmarBorrar(null)}
                onConfirm={handleEliminar}
                loading={borrando}
                title="Eliminar artículo"
                message={`¿Seguro que deseas eliminar "${confirmarBorrar?.nombre}"?`}
            />
        </div>
    );
}