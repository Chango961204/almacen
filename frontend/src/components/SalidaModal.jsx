import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Modal from "./Modal";
import Field from "./Field";
import { getInventarioProyecto } from "../services/inventarioService";

export default function SalidaModal({ open, onClose, onSave, proyectos }) {
    const [folio, setFolio] = useState("");
    const [proyectoId, setProyectoId] = useState("");
    const [fecha, setFecha] = useState("");
    const [responsable, setResponsable] = useState("");
    const [detalles, setDetalles] = useState([]);

    const [articulosProyecto, setArticulosProyecto] = useState([]);
    const [cargandoArticulos, setCargandoArticulos] = useState(false);
    const [guardando, setGuardando] = useState(false);

    // Limpiar al abrir
    useEffect(() => {
        if (open) {
            setFolio("");
            setProyectoId("");
            setFecha("");
            setResponsable("");
            setDetalles([]);
            setArticulosProyecto([]);
            setGuardando(false);
        }
    }, [open]);

    // Cargar SOLO los artículos con existencia en el proyecto elegido.
    // Así no se puede sacar un artículo que no está en el proyecto
    // (ni uno eliminado/inactivo).
    useEffect(() => {
        let vigente = true;

        if (!open || !proyectoId) {
            setArticulosProyecto([]);
            setCargandoArticulos(false);
            return;
        }

        setCargandoArticulos(true);

        getInventarioProyecto(proyectoId)
            .then((data) => {
                if (!vigente) return;
                setArticulosProyecto(
                    (data || []).filter((fila) => fila.articulo?.activo)
                );
            })
            .catch(() => {
                if (!vigente) return;
                setArticulosProyecto([]);
                toast.error("No se pudieron cargar los artículos del proyecto");
            })
            .finally(() => {
                if (vigente) setCargandoArticulos(false);
            });

        return () => {
            vigente = false;
        };
    }, [open, proyectoId]);

    function filaDe(articuloId) {
        return articulosProyecto.find(
            (a) => String(a.articulo.id) === String(articuloId)
        );
    }

    function disponibleDe(articuloId) {
        const fila = filaDe(articuloId);
        return fila ? Number(fila.cantidadActual) : 0;
    }

    function unidadDe(articuloId) {
        return filaDe(articuloId)?.articulo?.unidadMedida?.simbolo || "";
    }

    function cambiarProyecto(valor) {
        setProyectoId(valor);
        // Los artículos disponibles cambian con el proyecto: reiniciamos renglones
        setDetalles([]);
    }

    function agregarDetalle() {
        setDetalles([...detalles, { articuloId: "", cantidad: "" }]);
    }

    function actualizarDetalle(indice, campo, valor) {
        setDetalles(detalles.map((d, i) => (i === indice ? { ...d, [campo]: valor } : d)));
    }

    function quitarDetalle(indice) {
        setDetalles(detalles.filter((_, i) => i !== indice));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const detallesValidos = detalles.filter((d) => d.articuloId && d.cantidad);

        if (detallesValidos.length === 0) {
            toast.error("Agrega al menos un artículo a la salida");
            return;
        }

        const ids = detallesValidos.map((d) => Number(d.articuloId));

        if (new Set(ids).size !== ids.length) {
            toast.error("No puedes repetir el mismo artículo en una salida");
            return;
        }

        for (const d of detallesValidos) {
            const disponible = disponibleDe(d.articuloId);

            if (Number(d.cantidad) > disponible) {
                toast.error(
                    `Solo hay ${disponible} ${unidadDe(d.articuloId)} disponibles de ese artículo`
                );
                return;
            }
        }

        setGuardando(true);

        try {
            await onSave({
                folio,
                proyectoId: Number(proyectoId),
                fecha: `${fecha}T00:00:00.000Z`,
                responsable: responsable || undefined,
                detalles: detallesValidos.map((d) => ({
                    articuloId: Number(d.articuloId),
                    cantidad: Number(d.cantidad),
                })),
            });
        } finally {
            setGuardando(false);
        }
    }

    return (
        <Modal open={open} onClose={onClose} title="Nueva Salida">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Folio">
                        <input type="text" value={folio} onChange={(e) => setFolio(e.target.value)} required className="input-base" placeholder="Ej. SAL-001" />
                    </Field>

                    <Field label="Proyecto">
                        <select value={proyectoId} onChange={(e) => cambiarProyecto(e.target.value)} required className="input-base">
                            <option value="">Selecciona</option>
                            {proyectos.filter((p) => p.activo).map((p) => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Fecha">
                        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required className="input-base" />
                    </Field>

                    <Field label="Responsable">
                        <input type="text" value={responsable} onChange={(e) => setResponsable(e.target.value)} className="input-base" />
                    </Field>
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-700">Artículos que salen</p>
                        <button
                            type="button"
                            onClick={agregarDetalle}
                            disabled={!proyectoId || cargandoArticulos || articulosProyecto.length === 0}
                            className="btn btn-secondary py-1.5 text-xs"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Agregar artículo
                        </button>
                    </div>

                    {!proyectoId ? (
                        <p className="rounded-xl border border-dashed border-white/70 bg-white/30 p-6 text-center text-sm text-slate-400 backdrop-blur">
                            Primero selecciona el proyecto
                        </p>
                    ) : cargandoArticulos ? (
                        <p className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/70 bg-white/30 p-6 text-center text-sm text-slate-400 backdrop-blur">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Cargando artículos del proyecto…
                        </p>
                    ) : articulosProyecto.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-white/70 bg-white/30 p-6 text-center text-sm text-slate-400 backdrop-blur">
                            Este proyecto no tiene artículos con existencia
                        </p>
                    ) : detalles.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-white/70 bg-white/30 p-6 text-center text-sm text-slate-400 backdrop-blur">
                            Agrega al menos un artículo a la salida
                        </p>
                    ) : (
                        <div className="animate-slide-up space-y-2">
                            {detalles.map((d, index) => {
                                const disponible = disponibleDe(d.articuloId);

                                return (
                                    <div key={index} className="grid grid-cols-2 items-center gap-2 rounded-xl border border-white/70 bg-white/40 p-2 backdrop-blur-sm transition-all duration-150 hover:border-indigo-300 sm:grid-cols-[1.5fr_0.6fr_auto]">
                                        <select value={d.articuloId} onChange={(e) => actualizarDetalle(index, "articuloId", e.target.value)} className="input-base col-span-2 py-2 text-sm sm:col-span-1">
                                            <option value="">Artículo</option>
                                            {articulosProyecto.map((a) => (
                                                <option key={a.articulo.id} value={a.articulo.id}>
                                                    {a.articulo.nombre} — disp. {Number(a.cantidadActual)} {a.articulo.unidadMedida?.simbolo || ""}
                                                </option>
                                            ))}
                                        </select>

                                        <input
                                            type="number"
                                            min="0"
                                            step="any"
                                            max={disponible || undefined}
                                            value={d.cantidad}
                                            onChange={(e) => actualizarDetalle(index, "cantidad", e.target.value)}
                                            placeholder={disponible ? `Máx. ${disponible}` : "Cant."}
                                            className="input-base py-2 text-sm"
                                        />

                                        <button type="button" onClick={() => quitarDetalle(index)} className="btn btn-ghost btn-ghost-danger" title="Quitar">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} disabled={guardando} className="btn btn-secondary">
                        Cancelar
                    </button>
                    <button type="submit" disabled={detalles.length === 0 || guardando} className="btn btn-primary">
                        {guardando ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            "Guardar Salida"
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
