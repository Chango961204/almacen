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
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
                        placeholder="Ej. Construcción Torre Norte"
                    />
                </Field>

                <Field label="Descripción">
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
                    />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Fecha inicio">
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
                        />
                    </Field>

                    <Field label="Fecha fin">
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
                        />
                    </Field>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        Cancelar
                    </button>
                    <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                        Guardar
                    </button>
                </div>
            </form>
        </Modal>
    );
}