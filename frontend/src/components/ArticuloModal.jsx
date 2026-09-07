import { useEffect, useState } from "react";
import Modal from "./Modal";
import Field from "./Field";

export default function ArticuloModal({ open, onClose, onSave, articulo, marcas, unidadesMedida }) {
    const [codigo, setCodigo] = useState("");
    const [nombre, setNombre] = useState("");
    const [especificaciones, setEspecificaciones] = useState("");
    const [marcaId, setMarcaId] = useState("");
    const [unidadMedidaId, setUnidadMedidaId] = useState("");

    useEffect(() => {
        if (articulo) {
            setCodigo(articulo.codigo || "");
            setNombre(articulo.nombre || "");
            setEspecificaciones(articulo.especificaciones || "");
            setMarcaId(articulo.marcaId || "");
            setUnidadMedidaId(articulo.unidadMedidaId || "");
        } else {
            setCodigo("");
            setNombre("");
            setEspecificaciones("");
            setMarcaId("");
            setUnidadMedidaId("");
        }
    }, [articulo, open]);

    function handleSubmit(e) {
        e.preventDefault(); // evita que la página se recargue

        onSave({
            codigo: codigo || undefined,
            nombre,
            especificaciones: especificaciones || undefined,
            marcaId: Number(marcaId),
            unidadMedidaId: Number(unidadMedidaId),
        });
    }

    return (
        <Modal open={open} onClose={onClose} title={articulo ? "Editar Artículo" : "Nuevo Artículo"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Nombre">
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="input-base" placeholder="Ej. Tornillo de 3/4" />
                </Field>

                <Field label="Código">
                    <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} className="input-base" placeholder="Ej. ABC-123" />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Marca">
                        <select value={marcaId} onChange={(e) => setMarcaId(e.target.value)} required className="input-base">
                            <option value="">Selecciona</option>
                            {marcas.map((m) => (
                                <option key={m.id} value={m.id}>{m.nombre}</option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Unidad de Medida">
                        <select value={unidadMedidaId} onChange={(e) => setUnidadMedidaId(e.target.value)} required className="input-base">
                            <option value="">Selecciona</option>
                            {unidadesMedida.map((u) => (
                                <option key={u.id} value={u.id}>{u.nombre} ({u.simbolo})</option>
                            ))}
                        </select>
                    </Field>
                </div>

                <Field label="Especificaciones">
                    <textarea value={especificaciones} onChange={(e) => setEspecificaciones(e.target.value)} rows={3} className="input-base" />
                </Field>

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