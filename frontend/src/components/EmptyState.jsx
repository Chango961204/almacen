import { Inbox } from "lucide-react";

export default function EmptyState({ message = "No hay datos para mostrar" }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Inbox className="h-10 w-10 text-slate-300" />
            <p className="text-sm text-slate-500">{message}</p>
        </div>
    );
}