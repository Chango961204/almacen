import Spinner from "./Spinner";
import EmptyState from "./EmptyState";

export default function Table({ columns, rows, actions, loading = false, emptyMessage }) {
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

    return (
        <div className="glass animate-slide-up overflow-hidden rounded-3xl">
            <table className="min-w-full divide-y divide-white/60 text-sm">
                <thead className="bg-white/35">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                {col.label}
                            </th>
                        ))}
                        {actions && <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Acciones</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/50">
                    {rows.map((row, index) => (
                        <tr key={row.id ?? index} className="transition-colors duration-150 hover:bg-blue-500/10">
                            {columns.map((col) => (
                                <td key={col.key} className="px-5 py-3.5 text-slate-700">
                                    {col.render ? col.render(row) : row[col.key]}
                                </td>
                            ))}
                            {actions && (
                                <td className="px-5 py-3.5 text-right">
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
    );
}