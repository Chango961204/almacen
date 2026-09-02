import api from "./api";

export async function getArticulos() {
    const response = await api.get("/articulos");
    return response.data.data;
}

export async function getArticulo(articuloId) {
    const response = await api.get(`/articulos/${articuloId}`);
    return response.data.data;
}

export async function crearArticulo( data) {
    const response = await api.post(`/articulos`, data);
    return response.data.data;
}

export async function actualizarArticulo(articuloId, data) {
    const response = await api.put(`/articulos/${articuloId}`, data);
    return response.data.data;
}

export async function eliminarArticulo(articuloId) {
    const response = await api.delete(`/articulos/${articuloId}`);
    return response.data.data;
}