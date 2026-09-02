import api from "./api";

export async function getMarcas() {
    const response = await api.get("/marcas");
    return response.data.data;
}

export async function getMarca(marcaId) {
    const response = await api.get(`/marcas/${marcaId}`);
    return response.data.data;
}

export async function crearMarca(data) {
    const response = await api.post(`/marcas`, data);
    return response.data.data;
}

export async function actualizarMarca(marcaId, data) {
    const response = await api.put(`/marcas/${marcaId}`, data);
    return response.data.data;
}

/* export async function eliminarMarca(marcaId, data) {
    const response = await api.delete(`/marcas/${marcaId}`, data);
    return response.data.data;
}
 */
