import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
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
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Inventario
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Inicia sesión para continuar
                    </p>
                </div>

                {error && (
                    <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Correo electrónico
                        </label>

                        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)}
                            required autoComplete="email" className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="correo@ejemplo.com"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Contraseña
                        </label>

                        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)}
                            required autoComplete="current-password" className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                        {loading
                            ? "Iniciando sesión..."
                            : "Iniciar sesión"}
                    </button>
                </form>
            </div>
        </main>
    );
}