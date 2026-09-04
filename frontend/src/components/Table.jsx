import Spinner from "./Spinner";
import EmptyState from "./EmptyState";

export default function Table({ colums, rows, actions, loading = false, emptyMessage }) {
    if (loading) {
        return (
            <div className="flex justify-center py-16">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!rows || rows.length === 0) {
        return <EmptyState message={emptyMessage} />;
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                    <tr>
                        {colums.map((col) => (
                            <th key={col.key} className="px-4 py-3 text-left font-semibold text-slate-600">
                                {col.label}
                            </th>
                        ))}
                        {actions && <th className="px-4 py-3 text-right font-semibold text-slate-600"></th>}
                    </tr>

                </thead>
                <tbody className="divide-y divide-slate-100">
                    {rows.map((row, index) => (
                        <tr key={row.id ?? index} className="hover:bg-slate-50">
                            {colums.map((col) => (
                                <td key={col.key} className="px-4 py-3 text-slate-700">
                                    {col.render
                                        ? col.render(row)
                                        : row[col.key]}

                                </td>
                            ))}
                            {actions && (
                                <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-2">
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