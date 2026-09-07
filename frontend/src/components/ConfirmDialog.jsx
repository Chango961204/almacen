import { AlertTriangle, Loader2 } from "lucide-react";
import Modal from "./Modal";

export default function ConfirmDialog({ open, onClose, onConfirm, title = "¿Confirmar acción?", message, loading = false }) {
    return (
        <Modal open={open} onClose={onClose} title={title}>
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <p className="pt-1 text-sm text-slate-600">{message}</p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button onClick={onClose} disabled={loading} className="btn btn-secondary">
                    Cancelar
                </button>

                <button onClick={onConfirm} disabled={loading} className="btn btn-danger">
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Eliminando...
                        </>
                    ) : (
                        "Confirmar"
                    )}
                </button>
            </div>
        </Modal>
    );
}