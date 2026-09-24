import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AccesoDenegado from "../pages/AccesoDenegado";

export default function RoleRoute({ roles = [], children }) {
    const { usuario } = useAuth();

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    if (!roles.includes(usuario.rol)) {
        return <AccesoDenegado />;
    }

    return children;
}