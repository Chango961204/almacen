import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import Inventario from "../pages/Inventario.jsx";
import Articulos from "../pages/Articulos.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import AppLayout from "../layouts/AppLayout.jsx";
import Proyectos from "../pages/Proyectos.jsx";
import Entradas from "../pages/Entradas.jsx";
import Salidas from "../pages/Salidas.jsx";
import Devoluciones from "../pages/Devoluciones.jsx";
import Auditorias from "../pages/Auditorias.jsx";
import Usuarios from "../pages/Usuarios.jsx";
import RoleRoute from "../components/RoleRoute.jsx";
import { useAuth } from "../context/AuthContext.jsx";

// El "Inicio" no aplica para el rol USUARIO: se le manda directo al Inventario.
function InicioRoute() {
    const { usuario } = useAuth();

    if (usuario?.rol === "USUARIO") {
        return <Navigate to="/inventario" replace />;
    }

    return <Home />;
}

const ROLES_ADMIN = ["SUPER_ADMIN", "ADMIN"];

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={<ProtectedRoute> <AppLayout /> </ProtectedRoute>} >
                    <Route index element={<InicioRoute />} />

                    <Route path="inventario" element={<Inventario />} />

                    <Route path="articulos" element={<RoleRoute roles={ROLES_ADMIN}><Articulos /></RoleRoute>} />

                    <Route path="proyectos" element={<RoleRoute roles={ROLES_ADMIN}><Proyectos /></RoleRoute>} />

                    <Route path="entradas" element={<RoleRoute roles={ROLES_ADMIN}><Entradas /></RoleRoute>} />

                    <Route path="salidas" element={<RoleRoute roles={ROLES_ADMIN}><Salidas /></RoleRoute>} />

                    <Route path="devoluciones" element={<RoleRoute roles={ROLES_ADMIN}><Devoluciones /></RoleRoute>} />

                    <Route path="usuarios" element={<RoleRoute roles={ROLES_ADMIN}><Usuarios /></RoleRoute>} />

                    <Route path="auditorias" element={<RoleRoute roles={["SUPER_ADMIN"]}><Auditorias /></RoleRoute>} />
                    
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}
