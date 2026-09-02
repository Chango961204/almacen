import api from './api';

export async function crearDevolucion(data) {
    const response = await api.post(`/devoluciones/`, data);
    return response.data.data;
}   