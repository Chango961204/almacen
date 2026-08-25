import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    async function cargarUsuario() {
        try {
            const response = await api.get("/auth/me");

            setUsuario(response.data.usuario);
        } catch {
            setUsuario(null);
        } finally {
            setLoading(false);
        }
    }

    async function login(email, password) {
        const response = await api.post("/auth/login", {
            email,
            password,
        });

        setUsuario(response.data.usuario);

        return response.data;
    }

    async function logout() {
        try {
            await api.post("/auth/logout");
        } finally {
            setUsuario(null);
        }
    }

    useEffect(() => {
        cargarUsuario();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                usuario,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth debe utilizarse dentro de AuthProvider"
        );
    }

    return context;
}