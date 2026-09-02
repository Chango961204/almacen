import { useAuth } from "../context/AuthContext";

export default function Home() {
    const { usuario } = useAuth();

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-900">
                Bienvenido, {usuario?.nombre}
            </h2>

            <p className="mt-2 text-slate-600">
                Has iniciado sesión correctamente.
            </p>

            <div className="mt-6 rounded-lg bg-white p-6 shadow">
                <p className="text-sm text-slate-500">Usuario</p>
                <p className="font-medium text-slate-900">{usuario?.email}</p>

                <p className="mt-3 text-sm text-slate-500">Rol</p>
                <p className="font-medium text-slate-900">{usuario?.rol}</p>
            </div>
        </div>
    );
}