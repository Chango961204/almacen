import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children }) {
    useEffect(() => {
        if (!open) return;

        function manejarEscape(evento) {
            if (evento.key === "Escape") onClose();
        }

        document.addEventListener("keydown", manejarEscape);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", manejarEscape);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="animate-fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="animate-scale-in relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/5">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                    <button onClick={onClose} className="btn btn-ghost" title="Cerrar">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}