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

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={<ProtectedRoute> <AppLayout /> </ProtectedRoute>} >
                    <Route index element={<Home />} />

                    <Route path="inventario" element={<Inventario />} />

                    <Route path="articulos" element={<Articulos />} />

                    <Route path="proyectos" element={<Proyectos />} />

                    <Route path="entradas" element={<Entradas />} />

                    <Route path="salidas" element={<Salidas />} />

                    <Route path="devoluciones" element={<Devoluciones />} />

                    <Route path="usuarios" element={<RoleRoute roles={["SUPER_ADMIN", "ADMIN"]}><Usuarios /></RoleRoute>} />

                    <Route path="auditorias" element={<RoleRoute roles={["SUPER_ADMIN"]}><Auditorias /></RoleRoute>} />
                    
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}