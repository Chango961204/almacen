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
                    proyectos: proyectos.length,
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
        { label: "Artículos registrados", valor: estadisticas.articulos, icon: Boxes, gradiente: "from-blue-600 to-indigo-600" },
        { label: "Proyectos activos", valor: estadisticas.proyectos, icon: FolderKanban, gradiente: "from-emerald-600 to-teal-600" },
        { label: "Movimientos totales", valor: estadisticas.movimientos, icon: PackagePlus, gradiente: "from-amber-500 to-orange-600" },
        { label: "Unidades en almacén", valor: estadisticas.existencias, icon: Warehouse, gradiente: "from-violet-600 to-purple-600" },
    ];

    return (
        <div className="space-y-8">
            <div className="animate-slide-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-8 text-white shadow-lg shadow-blue-600/20">
                <div className="animate-float pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium capitalize text-blue-100">
                            {hoy}
                        </p>
                        <h2 className="mt-1 text-2xl font-bold">
                            Bienvenido, {usuario?.nombre}
                        </h2>
                        <p className="mt-2 max-w-xl text-sm text-blue-100">
                            Controla el inventario del almacén: registra entradas y salidas
                            de material y mantén las existencias al día.
                        </p>
                    </div>
                    <Link to="/inventario" className="group flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:bg-white/25">
                        Ver inventario
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </div>

            {error && <div className="animate-slide-down rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-100">{error}</div>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {kpis.map((kpi, indice) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={kpi.label} className="animate-slide-up rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md" style={{ animationDelay: `${indice * 60}ms` }}>
                            <div className="flex items-center justify-between">
                                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${kpi.gradiente} text-white shadow-sm`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="mt-4 text-3xl font-bold text-slate-900">
                                {kpi.valor}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">{kpi.label}</p>
                        </div>
                    );
                })}
            </div>

            <div>
                <h3 className="mb-4 text-lg font-bold text-slate-900">Accesos rápidos</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {accesosRapidos.map((acceso, indice) => {
                        const Icon = acceso.icon;
                        return (
                            <Link
                                key={acceso.to}
                                to={acceso.to}
                                className="group animate-slide-up flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                                style={{ animationDelay: `${150 + indice * 60}ms` }}
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-slate-900">{acceso.label}</p>
                                    <p className="truncate text-sm text-slate-500">{acceso.descripcion}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-blue-600" />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}