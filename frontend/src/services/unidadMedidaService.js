import api from './api';


export async function getUnidadesMedida() {
    const response = await api.get(`/unidadMedida`)
    return response.data.data;
}

export async function getUnidadMedida(unidadMedidaId) {
    const response = await api.get(`/unidadMedida/${unidadMedidaId}`);
    return response.data.data;
}

export async function crearUnidadMedida(data) {
    const response = await api.post(`/unidadMedida/`, data);
    return response.data.data;
}

export async function actualizarUnidadMedida(unidadMedidaId, data) {
    const response = await api.put(`/unidadMedida/${unidadMedidaId}`, data);
    return response.data.data;
}

