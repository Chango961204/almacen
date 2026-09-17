import { useEffect, useState } from "react";
import Modal from "./Modal";
import Field from "./Field";

const roles = ["SUPER_ADMIN", "ADMIN", "USUARIO"];

export default function UsuarioModal({ open, onClose, onSave }) {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("USUARIO");

    useEffect(() => {
        if (open) {
            setNombre("");
            setEmail("");
            setPassword("");
            setRol("USUARIO");
        }
    }, [open]);

    function handleSubmit(e) {
        e.preventDefault();

        onSave({
            nombre,
            email,
            password,
            rol,
        });
    }

    return (
        <Modal open={open} onClose={onClose} title="Nuevo Usuario">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Nombre completo">
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="input-base" placeholder="Ej. Juan Pérez" />
                </Field>

                <Field label="Correo electrónico">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-base" placeholder="correo@ejemplo.com" />
                </Field>

                <Field label="Contraseña">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="input-base" placeholder="Mínimo 6 caracteres" />
                </Field>

                <Field label="Rol">
                    <select value={rol} onChange={(e) => setRol(e.target.value)} className="input-base">
                        {roles.map((opcion) => (
                            <option key={opcion} value={opcion}>{opcion}</option>
                        ))}
                    </select>
                </Field>

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="btn btn-secondary">Cancelar</button>
                    <button type="submit" className="btn btn-primary">Crear Usuario</button>
                </div>
            </form>
        </Modal>
    );
}