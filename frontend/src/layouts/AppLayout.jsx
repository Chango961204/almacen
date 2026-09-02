import { Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function AppLayout() {
    const { usuario, logout } = useAuth();

    return (
        <div className="flex h-screen bg-slate-100">

            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center justify-between border-b bg-white px-6">
                    <p className="text-sm text-slate-500">
                        Panel de Control
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-slate-900">
                                {usuario?.nombre}
                            </p>
                            <p className="text-xs text-slate-500">
                                {usuario?.rol}
                            </p>
                        </div>

                        <button onClick={logout} className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100">
                            <LogOut className="h-4 w-4" />
                            salir
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}