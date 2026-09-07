import api from "./api";

export async function getSalidas() {
    const response = await api.get("/salidas");
    return response.data.data;
}

export async function crearSalida(data) {
    const response = await api.post("/salidas", data);
    return response.data.data;
}