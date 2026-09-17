export default function Badge({ tone = "gray", children }) {
    const tones = {
        green: "bg-emerald-500/10 text-emerald-700 ring-emerald-600/25 backdrop-blur",
        red: "bg-rose-500/10 text-rose-700 ring-rose-600/25 backdrop-blur",
        blue: "bg-blue-500/10 text-blue-700 ring-blue-600/25 backdrop-blur",
        gray: "bg-slate-500/10 text-slate-600 ring-slate-500/25 backdrop-blur",
        yellow: "bg-amber-500/10 text-amber-700 ring-amber-600/25 backdrop-blur",
    };

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}>
            {children}
        </span>
    );
}