import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
    children,
}) {
    const { usuario, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-slate-500">
                    Cargando...
                </p>
            </div>
        );
    }

    if (!usuario) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return children;
}