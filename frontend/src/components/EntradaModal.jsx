import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Modal from "./Modal";
import Field from "./Field";

export default function EntradaModal({ open, onClose, onSave, proyectos, articulos }) {

    const [folioFactura, setFolioFactura] = useState("");
    const [folioRequisicion, setFolioRequisicion] = useState("");
    const [fechaRecepcion, setFechaRecepcion] = useState("");
    const [proveedor, setProveedor] = useState("");
    const [distribuidor, setDistribuidor] = useState("");
    const [observaciones, setObservaciones] = useState("");

    const [detalles, setDetalles] = useState([]);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (open) {
            setFolioFactura("");
            setFolioRequisicion("");
            setFechaRecepcion("");
            setProveedor("");
            setDistribuidor("");
            setObservaciones("");
            setDetalles([]);
            setGuardando(false);
        }
    }, [open]);

    function agregarDetalle() {
        setDetalles([...detalles, { proyectoId: "", articulo: "", cantidad: "" }]);
    }

    function actualizarDetalle(indice, campo, valor) {
        setDetalles(detalles.map((d, i) => (i === indice ? { ...d, [campo]: valor } : d)));
    }

    function quitarDetalle(indice) {
        setDetalles(detalles.filter((_, i) => i !== indice));
    }

    // Convierte el artículo escrito (texto libre) en su id.
    // Si el nombre no existe en el catálogo, cancela el guardado.
    function resolverArticulos(detallesValidos) {
        return detallesValidos.map((d) => {
            const nombre = d.articulo.trim();

            const articulo = articulos.find(
                (a) => a.nombre.toLowerCase() === nombre.toLowerCase()
            );

            if (!articulo) {
                const error = new Error(
                    `El artículo "${nombre}" no existe. Regístralo primero en Artículos`
                );
                throw error;
            }

            return {
                proyectoId: Number(d.proyectoId),
                articuloId: articulo.id,
                cantidad: Number(d.cantidad),
            };
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const detallesValidos = detalles.filter(
            (d) => d.proyectoId && d.articulo.trim() && d.cantidad
        );

        setGuardando(true);

        try {
            await onSave({
                folioFactura: folioFactura || undefined,
                folioRequisicion: folioRequisicion || undefined,
                fechaRecepcion: `${fechaRecepcion}T00:00:00.000Z`,
                proveedor: proveedor || undefined,
                distribuidor: distribuidor || undefined,
                observaciones: observaciones || undefined,
                detalles: resolverArticulos(detallesValidos),
            });
        } catch (error) {
            toast.error(error.message || "No se pudo registrar la entrada");
        } finally {
            setGuardando(false);
        }
    }


    return (
        <Modal open={open} onClose={onClose} title="Nueva Entrada al Almacén">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-700">Artículos recibidos</p>
                        <button type="button" onClick={agregarDetalle} className="btn btn-secondary py-1.5 text-xs">
                            <Plus className="h-3.5 w-3.5" />
                            Agregar artículo
                        </button>
                    </div>

                    {detalles.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-white/70 bg-white/30 p-6 text-center text-sm text-slate-400 backdrop-blur">
                            Agrega al menos un artículo a la entrada
                        </p>
                    ) : (
                        <div className="animate-slide-up space-y-2">
                            {detalles.map((d, index) => (
                                <div key={index} className="grid grid-cols-2 items-center gap-2 rounded-xl border border-white/70 bg-white/40 p-2 backdrop-blur-sm transition-all duration-150 hover:border-indigo-300 sm:grid-cols-[1fr_1.5fr_0.6fr_auto]">
                                    <select value={d.proyectoId} onChange={(e) => actualizarDetalle(index, "proyectoId", e.target.value)} className="input-base col-span-2 py-2 text-sm sm:col-span-1">
                                        <option value="">Proyecto</option>
                                        {proyectos.map((p) => (
                                            <option key={p.id} value={p.id}>{p.nombre}</option>
                                        ))}
                                    </select>

                                    <input
                                        type="text"
                                        value={d.articulo}
                                        onChange={(e) => actualizarDetalle(index, "articulo", e.target.value)}
                                        list="articulos-datalist"
                                        className="input-base col-span-2 py-2 text-sm sm:col-span-1"
                                        placeholder="Escribe o elige un artículo"
                                    />

                                    <input type="number" value={d.cantidad} onChange={(e) => actualizarDetalle(index, "cantidad", e.target.value)} placeholder="Cant." className="input-base py-2 text-sm" />

                                    <button type="button" onClick={() => quitarDetalle(index)} className="btn btn-ghost btn-ghost-danger" title="Quitar">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            <datalist id="articulos-datalist">
                                {articulos.map((a) => (
                                    <option key={a.id} value={a.nombre} />
                                ))}
                            </datalist>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Folio Factura">
                        <input type="text" value={folioFactura} onChange={(e) => setFolioFactura(e.target.value)} className="input-base" placeholder="Ej. FAC-001" />
                    </Field>

                    <Field label="Folio Requisición">
                        <input type="text" value={folioRequisicion} onChange={(e) => setFolioRequisicion(e.target.value)} className="input-base" placeholder="Ej. REQ-001" />
                    </Field>

                    <Field label="Fecha de recepción">
                        <input type="date" value={fechaRecepcion} onChange={(e) => setFechaRecepcion(e.target.value)} required className="input-base" />
                    </Field>

                    <Field label="Proveedor">
                        <input type="text" value={proveedor} onChange={(e) => setProveedor(e.target.value)} className="input-base" />
                    </Field>

                    <Field label="Distribuidor">
                        <input type="text" value={distribuidor} onChange={(e) => setDistribuidor(e.target.value)} className="input-base" />
                    </Field>
                </div>

                <Field label="Observaciones">
                    <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={2} className="input-base" />
                </Field>


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
                            "Guardar Entrada"
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}