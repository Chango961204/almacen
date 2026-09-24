import { Link } from "react-router-dom";
import { ShieldX } from "lucide-react";

export default function AccesoDenegado() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center p-8">
            <div className="glass animate-scale-in w-full max-w-md rounded-3xl p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 ring-1 ring-inset ring-red-500/20">
                    <ShieldX className="h-7 w-7" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-slate-900">Acceso restringido</h2>
                <p className="mt-2 text-sm text-slate-500">
                    Tu cuenta no tiene permisos para ver esta sección.
                </p>
                <Link to="/" className="btn btn-primary mx-auto mt-6">
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}