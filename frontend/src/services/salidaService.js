import api from './api';

export async function crearSalida(data) {
    const response = await api.post(`/salidas/`, data);
    return response.data.data;
}
