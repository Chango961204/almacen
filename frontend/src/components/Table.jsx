import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";

export default function Table({ columns, rows, actions, loading = false, emptyMessage, pageSize = 10 }) {
    const [pagina, setPagina] = useState(1);

    useEffect(() => {
        setPagina(1);
    }, [rows]);

    if (loading) {
        return (
            <div className="flex justify-center py-24">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!rows || rows.length === 0) {
        return <EmptyState message={emptyMessage} />;
    }

    const totalPaginas = Math.max(1, Math.ceil(rows.length / pageSize));
    const paginaActual = Math.min(pagina, totalPaginas);
    const desde = (paginaActual - 1) * pageSize;
    const filasPagina = rows.slice(desde, desde + pageSize);

    return (
        <div className="glass animate-slide-up overflow-hidden rounded-3xl">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/60 text-sm">
                    <thead className="bg-white/35">
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key} className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-5">
                                    {col.label}
                                </th>
                            ))}
                            {actions && <th className="px-3 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-5">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/50">
                        {filasPagina.map((row, index) => (
                            <tr key={row.id ?? index} className="transition-colors duration-150 hover:bg-blue-500/10">
                                {columns.map((col) => (
                                    <td key={col.key} className="px-3 py-3 text-slate-700 sm:px-5">
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-3 py-3 text-right sm:px-5">
                                        <div className="flex justify-end gap-1.5">
                                            {actions(row)}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination pagina={paginaActual} totalPaginas={totalPaginas} onChange={setPagina} />
        </div>
    );
}