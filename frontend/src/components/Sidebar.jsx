import { NavLink } from "react-router-dom";
import { Boxes, FolderKanban, History, LayoutDashboard, PackageMinus, PackagePlus, RotateCcw, Users, Warehouse } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const menuItems = [
    { to: "/", label: "Inicio", icon: LayoutDashboard },
    { to: "/proyectos", label: "Proyectos", icon: FolderKanban },
    { to: "/articulos", label: "Artículos", icon: Boxes },
    { to: "/entradas", label: "Entradas", icon: PackagePlus },
    { to: "/inventario", label: "Inventario", icon: Warehouse },
    { to: "/salidas", label: "Salidas", icon: PackageMinus },
    { to: "/devoluciones", label: "Devoluciones", icon: RotateCcw },
    { to: "/usuarios", label: "Usuarios", icon: Users, roles: ["SUPER_ADMIN",] },
    { to: "/auditorias", label: "Auditorías", icon: History, roles: ["SUPER_ADMIN"] },
];

export default function Sidebar({ abierta = false, onCerrar = () => {} }) {
    const { usuario } = useAuth();
    const itemsVisibles = menuItems.filter(
        (item) => !item.roles || item.roles.includes(usuario?.rol)
    );

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
                    abierta ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                onClick={onCerrar}
                aria-hidden="true"
            />

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-white/60 bg-white/40 backdrop-blur-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
                    abierta ? "translate-x-0" : "-translate-x-full"
                }`}
            >
            <div className="flex h-16 items-center gap-3 border-b border-white/50 px-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/40">
                    <Warehouse className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-base font-bold leading-tight text-slate-900">Inventario</p>
                    <p className="text-xs leading-tight text-slate-400">Sistema de almacén</p>
                </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                {itemsVisibles.map((item) => {
                    const Icon = item.icon;
                    const isHome = item.to === "/";

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={isHome}
                            onClick={onCerrar}
                            className={({ isActive }) =>
                                `group relative flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${isActive
                                    ? "bg-linear-to-r from-blue-500/15 to-indigo-500/15 text-blue-700 shadow-[inset_0_1px_0_rgb(255_255_255/0.6)]"
                                    : "text-slate-500 hover:bg-white/50 hover:text-slate-900"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-linear-to-b from-blue-500 to-indigo-600 shadow-[0_0_12px_rgb(99_102_241/0.8)]" />
                                    )}
                                    <Icon className={`h-5 w-5 transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`} />
                                    {item.label}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="border-t border-white/50 p-4">
                <p className="px-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    Almacén Central
                </p>
            </div>
            </aside>
        </>
    );
}