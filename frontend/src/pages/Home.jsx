import { useAuth } from "../context/AuthContext";

export default function Home() {
    const { usuario, logout } = useAuth();

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">
                            Sistema de Inventario
                        </h1>

                        <p className="text-sm text-slate-500">
                            Panel principal
                        </p>
                    </div>

                    <button onClick={logout} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                        Cerrar sesión
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-10">
                <div className="rounded-2xl bg-white p-8 shadow">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Bienvenido, {usuario?.nombre}
                    </h2>

                    <p className="mt-2 text-slate-600">
                        Has iniciado sesión correctamente.
                    </p>

                    <div className="mt-6 rounded-lg bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">
                            Usuario
                        </p>

                        <p className="font-medium text-slate-900">
                            {usuario?.email}
                        </p>

                        <p className="mt-3 text-sm text-slate-500">
                            Rol
                        </p>

                        <p className="font-medium text-slate-900">
                            {usuario?.rol}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}