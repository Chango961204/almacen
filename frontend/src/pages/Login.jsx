import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Warehouse, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { usuario, login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (usuario) {
        return <Navigate to="/" replace />;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(email, password);

            navigate("/", {
                replace: true,
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "No se pudo iniciar sesión"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
            <div className="animate-blob pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-sky-300/40 blur-3xl" />
            <div className="animate-blob pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-violet-300/40 blur-3xl" style={{ animationDelay: "3s" }} />
            <div className="animate-blob pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 rounded-full bg-pink-300/30 blur-3xl" style={{ animationDelay: "6s" }} />

            <div className="animate-scale-in relative w-full max-w-md">
                <div className="glass rounded-4xl p-8">
                    <div className="mb-8 flex flex-col items-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/40 ring-1 ring-white/50">
                            <Warehouse className="h-8 w-8" />
                        </div>
                        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
                            Sistema para el Almacen
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Inicia sesión
                        </p>
                    </div>

                    {error && <div className="alert-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)}
                                    required autoComplete="email" placeholder="correo@ejemplo.com"
                                    className="input-base pl-11 py-3"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)}
                                    required autoComplete="current-password" placeholder="••••••••"
                                    className="input-base pl-11 py-3"
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5 text-base">
                            {loading
                                ? "Iniciando sesión..."
                                : "Iniciar sesión"}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-slate-400">
                    PMZ
                </p>
            </div>
        </main>
    );
}