import api from './api';

export async function getEntradas() {
    const response = await api.get(`/entradas`)
    return response.data.data;
}

export async function getEntrada(entradaId) {
    const response = await api.get(`/entradas/${entradaId}`);
    return response.data.data;
}

export async function crearEntrada(data) {
    const response = await api.post(`/entradas/`, data);
    return response.data.data;
}
