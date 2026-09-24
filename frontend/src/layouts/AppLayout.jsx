import { useState } from "react";
import { Outlet } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
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
    const [sidebarAbierta, setSidebarAbierta] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar
                abierta={sidebarAbierta}
                onCerrar={() => setSidebarAbierta(false)}
            />

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-white/60 bg-white/40 px-4 backdrop-blur-2xl sm:px-6">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <button
                            onClick={() => setSidebarAbierta(true)}
                            className="btn btn-ghost lg:hidden"
                            title="Abrir menú"
                            aria-label="Abrir menú"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        <p className="truncate text-sm font-medium text-slate-500">
                            Panel de Control
                        </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-md shadow-indigo-500/30 ring-1 ring-white/40">
                                {iniciales(usuario?.nombre)}
                            </div>
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-semibold text-slate-900">
                                    {usuario?.nombre}
                                </p>
                                <p className="text-xs capitalize text-slate-500">
                                    {usuario?.rol?.toLowerCase()}
                                </p>
                            </div>
                        </div>

                        <div className="hidden h-8 w-px bg-white/70 sm:block" />

                        <button
                            onClick={logout}
                            className="group flex items-center gap-2 rounded-full bg-white/40 p-2 text-sm font-medium text-slate-600 shadow-[inset_0_1px_0_rgb(255_255_255/0.8)] backdrop-blur-xl transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-600 sm:px-3 sm:py-2"
                            title="Cerrar sesión"
                        >
                            <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                            <span className="hidden sm:inline">Salir</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="animate-fade-in mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}