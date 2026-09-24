import { Plus } from "lucide-react";

export default function PageHeader({ title, subtitle, onAdd, addLabel }) {
    return (
        <div className="mb-6 flex animate-slide-down flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            </div>
            {onAdd && (
                <button onClick={onAdd} className="btn btn-primary group w-full sm:w-auto">
                    <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
                    {addLabel || "Agregar"}
                </button>
            )}
        </div>
    );
}