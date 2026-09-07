import api from "./api";

export async function getDevoluciones() {
    const response = await api.get("/devoluciones");
    return response.data.data;
}

export async function crearDevolucion(data) {
    const response = await api.post("/devoluciones", data);
    return response.data.data;
}