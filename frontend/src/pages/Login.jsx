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
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 px-4">
            <div className="animate-float pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
            <div className="animate-float pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl" style={{ animationDelay: "2s" }} />

            <div className="animate-scale-in relative w-full max-w-md">
                <div className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-blue-900/10 ring-1 ring-slate-900/5">
                    <div className="flex flex-col items-center bg-gradient-to-br from-blue-600 to-indigo-600 px-8 pt-10 pb-8 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/30">
                            <Warehouse className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="mt-4 text-2xl font-bold text-white">
                            Sistema de Inventario
                        </h1>
                        <p className="mt-1 text-sm text-blue-100">
                            Inicia sesión para continuar
                        </p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="animate-slide-down mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-100">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Correo electrónico
                                </label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)}
                                        required autoComplete="email" placeholder="correo@ejemplo.com"
                                        className="input-base pl-10 py-3"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)}
                                        required autoComplete="current-password" placeholder="••••••••"
                                        className="input-base pl-10 py-3"
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 text-base">
                                {loading
                                    ? "Iniciando sesión..."
                                    : "Iniciar sesión"}
                            </button>
                        </form>
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Almacén central · Gestión de inventario
                </p>
            </div>
        </main>
    );
}