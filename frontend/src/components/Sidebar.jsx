import { NavLink } from "react-router-dom";
import { Boxes, FolderKanban, LayoutDashboard, PackageMinus, PackagePlus, RotateCcw, Warehouse } from "lucide-react";

const menuItems = [
    { to: "/", label: "Inicio", icon: LayoutDashboard },
    { to: "/articulos", label: "Artículos", icon: Boxes },
    { to: "/proyectos", label: "Proyectos", icon: FolderKanban },
    { to: "/inventario", label: "Inventario", icon: Warehouse },
    { to: "/entradas", label: "Entradas", icon: PackagePlus },
    { to: "/salidas", label: "Salidas", icon: PackageMinus },
    { to: "/devoluciones", label: "Devoluciones", icon: RotateCcw },
];

export default function Sidebar() {
    return (
        <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
            <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-red from-blue-600 to-indigo-600 shadow-md shadow-blue-600/30">
                    <Warehouse className="h-5 w-5 text-white" />
                </div>
                <div>
                    <p className="text-base font-bold leading-tight text-slate-900">Inventario</p>
                    <p className="text-xs leading-tight text-slate-400">Sistema de almacén</p>
                </div>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isHome = item.to === "/";

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={isHome}
                            className={({ isActive }) =>
                                `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-gradient-to-red from-blue-50 to-indigo-50 text-blue-700"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-black from-blue-600 to-indigo-600" />
                                    )}
                                    <Icon className={`h-5 w-5 transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`} />
                                    {item.label}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="border-t border-slate-100 p-4">
                <p className="px-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    Almacén Central
                </p>
            </div>
        </aside>
    );
}