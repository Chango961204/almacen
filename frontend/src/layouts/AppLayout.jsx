import { Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function iniciales(nombre) {
    if (!nombre) return "U";
    return nombre
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0].toUpperCase())
        .join("");
}

export default function AppLayout() {
    const { usuario, logout } = useAuth();

    return (
        <div className="flex h-screen bg-slate-100">
            <Sidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur">
                    <p className="text-sm font-medium text-slate-500">
                        Panel de Control
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm shadow-blue-600/30">
                                {iniciales(usuario?.nombre)}
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-slate-900">
                                    {usuario?.nombre}
                                </p>
                                <p className="text-xs capitalize text-slate-500">
                                    {usuario?.rol?.toLowerCase()}
                                </p>
                            </div>
                        </div>

                        <div className="h-8 w-px bg-slate-200" />

                        <button
                            onClick={logout}
                            className="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                            title="Cerrar sesión"
                        >
                            <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                            Salir
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <div className="animate-fade-in mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}