import { Inbox } from "lucide-react";

export default function EmptyState({ message = "No hay datos para mostrar", hint }) {
    return (
        <div className="glass flex flex-col items-center justify-center gap-3 rounded-[1.5rem] py-16 text-center">
            <div className="animate-float flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500/15 to-indigo-500/15">
                <Inbox className="h-8 w-8 text-indigo-500" />
            </div>
            <p className="text-sm font-medium text-slate-500">{message}</p>
            {hint && <p className="text-xs text-slate-400">{hint}</p>}
        </div>
    );
}