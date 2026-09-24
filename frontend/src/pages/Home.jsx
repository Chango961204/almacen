import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Boxes, FolderKanban, PackageMinus, PackagePlus, RotateCcw, Warehouse } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getArticulos } from "../services/articuloService";
import { getProyectos } from "../services/proyectoService";
import { getEntradas } from "../services/entradaService";
import { getSalidas } from "../services/salidaService";
import { getDevoluciones } from "../services/devolucionService";
import { getInventarioAlmacen } from "../services/inventarioService";

const accesosRapidos = [
    { to: "/articulos", label: "Artículos", descripcion: "Catálogo y especificaciones", icon: Boxes },
    { to: "/proyectos", label: "Proyectos", descripcion: "Obras y frentes de trabajo", icon: FolderKanban },
    { to: "/inventario", label: "Inventario", descripcion: "Existencias del almacén", icon: Warehouse },
    { to: "/entradas", label: "Entradas", descripcion: "Recepción de material", icon: PackagePlus },
    { to: "/salidas", label: "Salidas", descripcion: "Material a proyectos", icon: PackageMinus },
    { to: "/devoluciones", label: "Devoluciones", descripcion: "Material devuelto", icon: RotateCcw },
];

export default function Home() {
    const { usuario } = useAuth();

    const [estadisticas, setEstadisticas] = useState({
        articulos: 0,
        proyectos: 0,
        movimientos: 0,
        existencias: 0,
    });
    const [error, setError] = useState("");

    useEffect(() => {
        async function cargarDatos() {
            try {
                const [articulos, proyectos, entradas, salidas, devoluciones, inventario] = await Promise.all([
                    getArticulos(),
                    getProyectos(),
                    getEntradas(),
                    getSalidas(),
                    getDevoluciones(),
                    getInventarioAlmacen(),
                ]);

                setEstadisticas({
                    articulos: articulos.length,
                    proyectos: proyectos.filter((proyecto) => proyecto.activo).length,
                    movimientos: entradas.length + salidas.length + devoluciones.length,
                    existencias: inventario.reduce((total, fila) => total + Number(fila.cantidadActual || 0), 0),
                });
            } catch {
                setError("No se pudieron cargar los indicadores");
            }
        }

        cargarDatos();
    }, []);

    const hoy = new Date().toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const kpis = [
        { label: "Artículos registrados", valor: estadisticas.articulos, icon: Boxes, gradiente: "from-blue-500 to-indigo-600" },
        { label: "Proyectos activos", valor: estadisticas.proyectos, icon: FolderKanban, gradiente: "from-emerald-500 to-teal-600" },
        { label: "Movimientos totales", valor: estadisticas.movimientos, icon: PackagePlus, gradiente: "from-amber-500 to-orange-500" },
        { label: "Unidades en almacén", valor: estadisticas.existencias, icon: Warehouse, gradiente: "from-violet-500 to-purple-600" },
    ];

    return (
        <div className="space-y-8">
            <div className="glass animate-slide-up relative overflow-hidden rounded-[1.75rem] p-8">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sky-300/40 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-violet-300/40 blur-3xl" />
                <div className="relative flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium capitalize text-slate-500">
                            {hoy}
                        </p>
                        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                            Bienvenido, {usuario?.nombre}
                        </h2>
                        <p className="mt-2 max-w-xl text-sm text-slate-500">
                            Controla el inventario del almacén: registra entradas y salidas
                            de material y mantén las existencias al día.
                        </p>
                    </div>
                    <Link to="/inventario" className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/40">
                        Ver inventario
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </div>

            {error && <div className="alert-error">{error}</div>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {kpis.map((kpi, indice) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={kpi.label} className="glass animate-slide-up p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl" style={{ animationDelay: `${indice * 60}ms` }}>
                            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${kpi.gradiente} text-white shadow-md ring-1 ring-white/40`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                                {kpi.valor}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">{kpi.label}</p>
                        </div>
                    );
                })}
            </div>

            <div>
                <h3 className="mb-4 text-lg font-bold tracking-tight text-slate-900">Accesos rápidos</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {accesosRapidos.map((acceso, indice) => {
                        const Icon = acceso.icon;
                        return (
                            <Link
                                key={acceso.to}
                                to={acceso.to}
                                className="glass group animate-slide-up flex items-center gap-4 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                                style={{ animationDelay: `${150 + indice * 60}ms` }}
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 ring-1 ring-inset ring-blue-600/20 transition-all duration-200 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:text-white group-hover:ring-white/40">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-slate-900">{acceso.label}</p>
                                    <p className="truncate text-sm text-slate-500">{acceso.descripcion}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-indigo-600" />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}