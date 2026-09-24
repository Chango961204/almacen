import { ChevronLeft, ChevronRight } from "lucide-react";

function obtenerPaginas(pagina, total) {
    const set = new Set([1, total, pagina - 1, pagina, pagina + 1]);
    const paginas = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

    const resultado = [];
    let previo = 0;

    for (const p of paginas) {
        if (p - previo > 1) resultado.push("...");
        resultado.push(p);
        previo = p;
    }

    return resultado;
}

export default function Pagination({ pagina, totalPaginas, onChange }) {
    if (totalPaginas <= 1) return null;

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/60 px-5 py-3">
            <p className="text-xs font-medium text-slate-400">
                Página {pagina} de {totalPaginas}
            </p>

            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => onChange(pagina - 1)}
                    disabled={pagina === 1}
                    className="btn btn-secondary px-2.5 py-1.5"
                    title="Anterior"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {obtenerPaginas(pagina, totalPaginas).map((item, indice) =>
                    item === "..." ? (
                        <span key={`ellipsis-${indice}`} className="px-1.5 text-xs text-slate-300">
                            …
                        </span>
                    ) : (
                        <button
                            key={item}
                            type="button"
                            onClick={() => onChange(item)}
                            className={`h-8 min-w-8 rounded-full px-2 text-xs font-semibold transition-all duration-150 ${
                                item === pagina
                                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-indigo-500/30"
                                    : "text-slate-500 hover:bg-white/60"
                            }`}
                        >
                            {item}
                        </button>
                    )
                )}

                <button
                    type="button"
                    onClick={() => onChange(pagina + 1)}
                    disabled={pagina === totalPaginas}
                    className="btn btn-secondary px-2.5 py-1.5"
                    title="Siguiente"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}