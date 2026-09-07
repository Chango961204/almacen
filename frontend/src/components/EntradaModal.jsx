import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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

    useEffect(() => {
        if (open) {
            setFolioFactura("");
            setFolioRequisicion("");
            setFechaRecepcion("");
            setProveedor("");
            setDistribuidor("");
            setObservaciones("");
            setDetalles([]);
        }
    }, [open]);

    function agregarDetalle() {
        setDetalles([...detalles, { proyectoId: "", articuloId: "", cantidad: "" }]);
    }

    function actualizarDetalle(indice, campo, valor) {
        setDetalles(detalles.map((d, i) => (i === indice ? { ...d, [campo]: valor } : d)));
    }

    function quitarDetalle(indice) {
        setDetalles(detalles.filter((_, i) => i !== indice));
    }

    function handleSubmit(e) {
        e.preventDefault();

        const detallesValidos = detalles.filter((d) => d.proyectoId && d.articuloId && d.cantidad);

        onSave({
            folioFactura: folioFactura || undefined,
            folioRequisicion: folioRequisicion || undefined,
            fechaRecepcion: `${fechaRecepcion}T00:00:00.000Z`,
            proveedor: proveedor || undefined,
            distribuidor: distribuidor || undefined,
            observaciones: observaciones || undefined,
            detalles: detallesValidos.map((d) => ({
                proyectoId: Number(d.proyectoId),
                articuloId: Number(d.articuloId),
                cantidad: Number(d.cantidad),
            })),
        });
    }

    return (
        <Modal open={open} onClose={onClose} title="Nueva Entrada al Almacén">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Folio Factura">
                        <input type="text" value={folioFactura} onChange={(e) => setFolioFactura(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500" placeholder="Ej. FAC-001" />
                    </Field>

                    <Field label="Folio Requisición">
                        <input type="text" value={folioRequisicion} onChange={(e) => setFolioRequisicion(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500" placeholder="Ej. REQ-001" />
                    </Field>

                    <Field label="Fecha de recepción">
                        <input type="date" value={fechaRecepcion} onChange={(e) => setFechaRecepcion(e.target.value)} required className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500" />
                    </Field>

                    <Field label="Proveedor">
                        <input type="text" value={proveedor} onChange={(e) => setProveedor(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500" />
                    </Field>

                    <Field label="Distribuidor">
                        <input type="text" value={distribuidor} onChange={(e) => setDistribuidor(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500" />
                    </Field>
                </div>

                <Field label="Observaciones">
                    <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={2} className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500" />
                </Field>

                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-700">Artículos recibidos</p>
                        <button type="button" onClick={agregarDetalle} className="flex items-center gap-1 rounded-lg border border-blue-600 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50">
                            <Plus className="h-3.5 w-3.5" />
                            Agregar artículo
                        </button>
                    </div>

                    {detalles.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-slate-400">
                            Agrega al menos un artículo a la entrada
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {detalles.map((d, index) => (
                                <div key={index} className="grid grid-cols-[1fr_1.5fr_0.6fr_auto] items-center gap-2 rounded-lg border border-slate-200 p-2">
                                    <select value={d.proyectoId} onChange={(e) => actualizarDetalle(index, "proyectoId", e.target.value)} className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm outline-none focus:border-blue-500">
                                        <option value="">Proyecto</option>
                                        {proyectos.map((p) => (
                                            <option key={p.id} value={p.id}>{p.nombre}</option>
                                        ))}
                                    </select>

                                    <select value={d.articuloId} onChange={(e) => actualizarDetalle(index, "articuloId", e.target.value)} className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm outline-none focus:border-blue-500">
                                        <option value="">Artículo</option>
                                        {articulos.map((a) => (
                                            <option key={a.id} value={a.id}>{a.nombre}</option>
                                        ))}
                                    </select>

                                    <input type="number" value={d.cantidad} onChange={(e) => actualizarDetalle(index, "cantidad", e.target.value)} placeholder="Cant." className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm outline-none focus:border-blue-500" />

                                    <button type="button" onClick={() => quitarDetalle(index)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" title="Quitar">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        Cancelar
                    </button>
                    <button type="submit" disabled={detalles.length === 0} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                        Guardar Entrada
                    </button>
                </div>
            </form>
        </Modal>
    );
}