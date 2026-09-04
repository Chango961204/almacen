import Modal from "./Modal";

export default function ConfirmDialog({ open, onClose, onConfirm, title = "¿Confirmar acción?", message, loading = false }) {
    return (
        <Modal open={open} onClose={onClose} title={title}>
            <p className="text-slate-600">{message}</p>

            <div className="mt-6 flex justify-end gap-3">
                <button onClick={onClose} disabled={loading} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Cancelar
                </button>

                <button onClick={onConfirm} disabled={loading} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                    {loading ? "Eliminado..." : "Confirmar"}

                </button>

            </div>

        </Modal>
    );

}