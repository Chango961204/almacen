import { Plus } from "lucide-react";

export default function PageHeader({ title, subtitle, onAdd, addLabel }) {
    return (
        <div className="mb-6 flex animate-slide-down items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            </div>
            {onAdd && (
                <button onClick={onAdd} className="btn btn-primary group">
                    <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
                    {addLabel || "Agregar"}
                </button>
            )}
        </div>
    );
}