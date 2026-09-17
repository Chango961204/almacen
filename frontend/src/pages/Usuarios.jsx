import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { getUsuarios, crearUsuario } from "../services/usuarioService";
import PageHeader from "../components/PageHeader";
import Table from "../components/Table";
import Badge from "../components/Badge";
import UsuarioModal from "../components/UsuarioModal";

const coloresRol = {
    SUPER_ADMIN: "red",
    ADMIN: "blue",
    USUARIO: "gray",
};

function formatearFechaHora(iso) {
    if (!iso) return "-";
    return format(parseISO(iso), "dd/MM/yyyy HH:mm");
}

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);

    async function cargarUsuarios() {
        setLoading(true);
        setError("");
        try {
            const data = await getUsuarios();
            setUsuarios(data);
        } catch {
            setError("No se pudieron cargar los usuarios");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        cargarUsuarios();
    }, []);

    async function handleSave(datos) {
        try {
            await crearUsuario(datos);
            setModalAbierto(false);
            toast.success("Usuario creado correctamente");
            cargarUsuarios();
        } catch (error) {
            toast.error(error.response?.data?.message || "No se pudo crear el usuario");
        }
    }

    const columns = [
        { key: "id", label: "#", render: (fila) => fila.id },
        { key: "nombre", label: "Nombre" },
        { key: "email", label: "Correo" },
        { key: "rol", label: "Rol", render: (fila) => <Badge tone={coloresRol[fila.rol] || "gray"}>{fila.rol}</Badge> },
        { key: "estado", label: "Estado", render: (fila) => <Badge tone={fila.activo ? "green" : "red"}>{fila.activo ? "Activo" : "Inactivo"}</Badge> },
        { key: "creado", label: "Creado", render: (fila) => formatearFechaHora(fila.creadoEn) },
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader title="Usuarios" subtitle="Registra y consulta los usuarios del sistema" onAdd={() => setModalAbierto(true)} addLabel="Nuevo Usuario" />

            {error && <div className="alert-error">{error}</div>}

            <Table
                columns={columns}
                rows={usuarios}
                loading={loading}
                emptyMessage="No hay usuarios registrados"
            />

            <UsuarioModal
                open={modalAbierto}
                onClose={() => setModalAbierto(false)}
                onSave={handleSave}
            />
        </div>
    );
}