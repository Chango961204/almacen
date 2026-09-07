import { Inbox } from "lucide-react";

export default function EmptyState({ message = "No hay datos para mostrar", hint }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="animate-float flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <Inbox className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">{message}</p>
            {hint && <p className="text-xs text-slate-400">{hint}</p>}
        </div>
    );
}