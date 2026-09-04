import { NavLink } from "react-router-dom";
import { Boxes, FolderKanban, LayoutDashboard, PackageMinus, PackagePlus, RotateCcw, Warehouse, } from "lucide-react";

const menuItems = [
    { to: "/", label: "Inicio", icon: LayoutDashboard, enabled: true, },
    { to: "/articulos", label: "Artículos", icon: Boxes, enabled: false, },
    { to: "/proyectos", label: "Proyectos", icon: FolderKanban, enabled: false, },
    { to: "/inventario", label: "Inventario", icon: Warehouse, enabled: true, },
    { to: "/entradas", label: "Entradas", icon: PackagePlus, enabled: false, },
    { to: "/salidas", label: "Salidas", icon: PackageMinus, enabled: false, },
    { to: "/devoluciones", label: "Devoluciones", icon: RotateCcw, enabled: false, },
];

export default function Sidebar() {
    return (
        <aside className="flex h-full w-64 flex-col border-r bg-white">
            <div className="flex h-16 items-center gap-2 border-b px-6">
                <Warehouse className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold text-slate-900">
                    Inventario
                </span>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    if (!item.enabled) {
                        return (
                            <button key={item.to} disabled className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400">
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </button>
                        );
                    }

                    return (
                        <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive
                                ? "bg-blue-50 text-blue-700"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`
                        }
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}