import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import AppLayout from "../layouts/AppLayout.jsx";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={<ProtectedRoute> <AppLayout /> </ProtectedRoute>} >
                    <Route index element={<Home />} />


                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}