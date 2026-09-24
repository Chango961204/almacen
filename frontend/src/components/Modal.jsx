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
        <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-4">
            <div className="animate-fade-in absolute inset-0 bg-slate-900/25 backdrop-blur-md" onClick={onClose} />

            <div className="glass-strong glass animate-scale-in relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[1.75rem] p-5 shadow-2xl sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold tracking-tight text-slate-900">{title}</h2>
                    <button onClick={onClose} className="btn btn-ghost" title="Cerrar">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}