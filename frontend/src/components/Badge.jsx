export default function Badge({ tone = "gray", children }) {
    const tones = {
        green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
        red: "bg-red-50 text-red-700 ring-red-600/20",
        blue: "bg-blue-50 text-blue-700 ring-blue-600/20",
        gray: "bg-slate-100 text-slate-700 ring-slate-500/20",
        yellow: "bg-amber-50 text-amber-700 ring-amber-600/20",
    };

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}>
            {children}
        </span>
    );
}