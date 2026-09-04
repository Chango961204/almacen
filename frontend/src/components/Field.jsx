

export default function Field({ label, error, children }) {
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">{label}</label>
            {children}
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}

