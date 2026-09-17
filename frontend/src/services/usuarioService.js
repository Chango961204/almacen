import api from "./api";

export async function getUsuarios() {
    const response = await api.get("/usuarios");
    return response.data.data;
}

export async function crearUsuario(data) {
    const response = await api.post("/usuarios", data);
    return response.data.data;
}
