import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { crearMarca, getMarcas } from "../services/marcaService";
import { crearUnidadMedida, getUnidadesMedida } from "../services/unidadMedidaService";
import Modal from "./Modal";
import Field from "./Field";

export default function ArticuloModal({ open, onClose, onSave, articulo, marcas, unidadesMedida }) {
    const [codigo, setCodigo] = useState("");
    const [nombre, setNombre] = useState("");
    const [especificaciones, setEspecificaciones] = useState("");
    const [marca, setMarca] = useState("");
    const [unidad, setUnidad] = useState("");
    const [simbolo, setSimbolo] = useState("");
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (articulo) {
            const marcaActual = marcas.find((m) => m.id === articulo.marcaId);
            const unidadActual = unidadesMedida.find((u) => u.id === articulo.unidadMedidaId);

            setCodigo(articulo.codigo || "");
            setNombre(articulo.nombre || "");
            setEspecificaciones(articulo.especificaciones || "");
            setMarca(marcaActual?.nombre || "");
            setUnidad(unidadActual?.nombre || "");
            setSimbolo(unidadActual?.simbolo || "");
        } else {
            setCodigo("");
            setNombre("");
            setEspecificaciones("");
            setMarca("");
            setUnidad("");
            setSimbolo("");
        }
    }, [articulo, open, marcas, unidadesMedida]);

    // Devuelve el id de la marca: si el usuario escribió una que ya
    // existe la reutiliza; si no, la crea primero y usa la nueva.
    async function resolverMarca() {
        const nombreMarca = marca.trim();

        if (!nombreMarca) {
            throw new Error("Escribe o selecciona una marca");
        }

        const existente = marcas.find(
            (m) => m.nombre.toLowerCase() === nombreMarca.toLowerCase()
        );

        if (existente) {
            return existente.id;
        }

        try {
            const nueva = await crearMarca({ nombre: nombreMarca });
            return nueva.id;
        } catch (error) {
            if (error.response?.status === 409) {
                const actualizadas = await getMarcas();
                const existente = actualizadas.find(
                    (m) => m.nombre.toLowerCase() === nombreMarca.toLowerCase()
                );
                if (existente) return existente.id;
            }
            throw error;
        }
    }

    // Igual que la marca pero la unidad necesita además símbolo
    // (el backend exige ambos).
    async function resolverUnidad() {
        const nombreUnidad = unidad.trim();

        if (!nombreUnidad) {
            throw new Error("Escribe o selecciona una unidad de medida");
        }

        const existente = unidadesMedida.find(
            (u) => u.nombre.toLowerCase() === nombreUnidad.toLowerCase()
        );

        if (existente) {
            return existente.id;
        }

        if (!simbolo.trim()) {
            throw new Error("Escribe el símbolo de la nueva unidad de medida");
        }

        try {
            const nueva = await crearUnidadMedida({
                nombre: nombreUnidad,
                simbolo: simbolo.trim(),
            });

            return nueva.id;
        } catch (error) {
            if (error.response?.status === 409) {
                const actualizadas = await getUnidadesMedida();
                const existente = actualizadas.find(
                    (u) => u.nombre.toLowerCase() === nombreUnidad.toLowerCase()
                );
                if (existente) return existente.id;
            }
            throw error;
        }
    }

    const esUnidadNueva = Boolean(
        unidad.trim() &&
        !unidadesMedida.some((u) => u.nombre.toLowerCase() === unidad.trim().toLowerCase())
    );

    async function handleSubmit(e) {
        e.preventDefault();

        setGuardando(true);

        try {
            const marcaId = await resolverMarca();
            const resueltaUnidadId = await resolverUnidad();

            await onSave({
                codigo: codigo || undefined,
                nombre,
                especificaciones: especificaciones || undefined,
                marcaId,
                unidadMedidaId: resueltaUnidadId,
            });
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "No se pudo guardar el artículo"
            );
        } finally {
            setGuardando(false);
        }
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
                        <input
                            type="text"
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}
                            required
                            list="marcas-datalist"
                            className="input-base"
                            placeholder="Escribe o elige una marca"
                        />
                        <datalist id="marcas-datalist">
                            {marcas.map((m) => (
                                <option key={m.id} value={m.nombre} />
                            ))}
                        </datalist>
                        <p className="text-xs text-slate-400">
                            Si escribes una marca nueva se registrará automáticamente
                        </p>
                    </Field>

                    <Field label="Unidad de Medida">
                        <input
                            type="text"
                            value={unidad}
                            onChange={(e) => setUnidad(e.target.value)}
                            required
                            list="unidades-datalist"
                            className="input-base"
                            placeholder="Escribe o elige una unidad"
                        />
                        <datalist id="unidades-datalist">
                            {unidadesMedida.map((u) => (
                                <option key={u.id} value={u.nombre} />
                            ))}
                        </datalist>

                        {esUnidadNueva ? (
                            <div className="animate-slide-down mt-2 space-y-1">
                                <input
                                    type="text"
                                    value={simbolo}
                                    onChange={(e) => setSimbolo(e.target.value)}
                                    required
                                    className="input-base"
                                    placeholder="Símbolo (ej. kg)"
                                />
                                <p className="text-xs text-slate-400">
                                    Unidad nueva: escribe su símbolo para registrarla
                                </p>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400">
                                Si escribes una unidad nueva se registrará automáticamente
                            </p>
                        )}
                    </Field>
                </div>

                <Field label="Especificaciones">
                    <textarea value={especificaciones} onChange={(e) => setEspecificaciones(e.target.value)} rows={3} className="input-base" />
                </Field>

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} disabled={guardando} className="btn btn-secondary">
                        Cancelar
                    </button>
                    <button type="submit" disabled={guardando} className="btn btn-primary">
                        {guardando ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            "Guardar"
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}