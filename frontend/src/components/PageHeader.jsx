import { Plus } from "lucide-react";

export default function PageHeader({ title, subtitle, onAdd, addLabel }) {
    return (
        <div className="mb-6 flex items-center justify-between">
            <div>
                <h1 className="mt-1 text-sm text-slate-900">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            </div>
            {onAdd && (
                <button onClick={onAdd} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                    {addLabel || "Agregar"}
                </button>
            )}
        </div>
    );
}