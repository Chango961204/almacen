import { useEffect, useState } from "react";
import Modal from "./Modal.jsx";
import Field from "./Field.jsx";

function aFechaInput(iso) {
    if (!iso) return "";
    return iso.slice(0, 10);
}

export default function ProyectoModal({ open, onClose, onSave, proyecto }) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    useEffect(() => {
        if (proyecto) {
            setNombre(proyecto.nombre || "");
            setDescripcion(proyecto.descripcion || "");
            setFechaInicio(aFechaInput(proyecto.fechaInicio));
            setFechaFin(aFechaInput(proyecto.fechaFin));
        } else {
            setNombre("");
            setDescripcion("");
            setFechaInicio("");
            setFechaFin("");
        }
    }, [proyecto, open]);

    function handleSubmit(e) {
        e.preventDefault();

        onSave({
            nombre,
            descripcion: descripcion || undefined,
            fechaInicio: fechaInicio ? `${fechaInicio}T00:00:00.000Z` : undefined,
            fechaFin: fechaFin ? `${fechaFin}T00:00:00.000Z` : undefined,
        });
    }

    return (
        <Modal open={open} onClose={onClose} title={proyecto ? "Editar Proyecto" : "Nuevo Proyecto"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Nombre">
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        className="input-base"
                        placeholder="Ej. Construcción Torre Norte"
                    />
                </Field>

                <Field label="Descripción">
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        rows={3}
                        className="input-base"
                    />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Fecha inicio">
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="input-base"
                        />
                    </Field>

                    <Field label="Fecha fin">
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="input-base"
                        />
                    </Field>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="btn btn-secondary">
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Guardar
                    </button>
                </div>
            </form>
        </Modal>
    );
}