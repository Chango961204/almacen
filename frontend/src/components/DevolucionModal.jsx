import { useEffect, useState } from "react";
import Modal from "./Modal";
import Field from "./Field";

export default function DevolucionModal({ open, onClose, onSave, salidas }) {
    const [folio, setFolio] = useState("");
    const [salidaId, setSalidaId] = useState("");
    const [fecha, setFecha] = useState("");
    const [motivo, setMotivo] = useState("");
    const [detalles, setDetalles] = useState([]);

    // Limpiar el formulario al abrir
    useEffect(() => {
        if (open) {
            setFolio("");
            setSalidaId("");
            setFecha("");
            setMotivo("");
            setDetalles([]);
        }
    }, [open]);

    // CLAVE: al elegir la salida, generamos los renglones a partir de sus detalles
    useEffect(() => {
        const salida = salidas.find((s) => s.id === Number(salidaId));

        if (salida) {
            setDetalles(
                salida.detalles.map((d) => ({
                    salidaDetalleId: d.id,   // ← el id del detalle de la salida
                    cantidad: "",
                }))
            );
        } else {
            setDetalles([]);
        }
    }, [salidaId]);

    function actualizarCantidad(indice, valor) {
        setDetalles(detalles.map((d, i) => (i === indice ? { ...d, cantidad: valor } : d)));
    }

    function handleSubmit(e) {
        e.preventDefault();

        // Solo los renglones con cantidad mayor a cero
        const detallesValidos = detalles.filter((d) => d.cantidad && Number(d.cantidad) > 0);

        onSave({
            folio,
            salidaId: Number(salidaId),
            fecha: `${fecha}T00:00:00.000Z`,
            motivo,
            detalles: detallesValidos.map((d) => ({
                salidaDetalleId: d.salidaDetalleId,
                cantidad: Number(d.cantidad),
            })),
        });
    }

    const salidaElegida = salidas.find((s) => s.id === Number(salidaId));

    return (
        <Modal open={open} onClose={onClose} title="Nueva Devolución">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Folio">
                        <input type="text" value={folio} onChange={(e) => setFolio(e.target.value)} required className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500" placeholder="Ej. DEV-001" />
                    </Field>

                    <Field label="Salida a devolver">
                        <select value={salidaId} onChange={(e) => setSalidaId(e.target.value)} required className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500">
                            <option value="">Selecciona la salida</option>
                            {salidas.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.folio} — {s.proyecto?.nombre || "Sin proyecto"}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Fecha">
                        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500" />
                    </Field>

                    <Field label="Motivo">
                        <input type="text" value={motivo} onChange={(e) => setMotivo(e.target.value)} required minLength={3} className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500" placeholder="Ej. Material en buen estado" />
                    </Field>
                </div>

                <div>
                    <p className="mb-2 text-sm font-medium text-slate-700">
                        Artículos a devolver
                    </p>

                    {!salidaElegida ? (
                        <p className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-slate-400">
                            Primero selecciona la salida
                        </p>
                    ) : detalles.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-slate-400">
                            Esta salida no tiene artículos
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {detalles.map((d, index) => {
                                const salidaDetalle = salidaElegida.detalles[index];

                                return (
                                    <div key={d.salidaDetalleId} className="grid grid-cols-[1.5fr_0.6fr_0.7fr] items-center gap-2 rounded-lg border border-slate-200 p-2">
                                        <div className="text-sm text-slate-700">
                                            {salidaDetalle?.articulo?.nombre || "Artículo"}
                                        </div>

                                        <div className="text-sm text-slate-500">
                                            Salieron: {Number(salidaDetalle?.cantidad)}{" "}
                                            {salidaDetalle?.articulo?.unidadMedida?.simbolo || ""}
                                        </div>

                                        <input
                                            type="number"
                                            value={d.cantidad}
                                            onChange={(e) => actualizarCantidad(index, e.target.value)}
                                            placeholder="Devolver"
                                            className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        Cancelar
                    </button>
                    <button type="submit" disabled={detalles.filter((d) => d.cantidad).length === 0} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                        Guardar Devolución
                    </button>
                </div>
            </form>
        </Modal>
    );
}