import api from './api';

export async function getProyectos() {
    const response = await api.get('/proyectos');
    return response.data.data;
}

export async function getProyecto(proyectoId) {
    const response = await api.get(`/proyectos/${proyectoId}`);
    return response.data.data;
}

export async function crearProyecto(proyectoData) {
    const response = await api.post('/proyectos', proyectoData);
    return response.data.data;
}

export async function actualizarProyecto(proyectoId, proyectoData) {
    const response = await api.put(`/proyectos/${proyectoId}`, proyectoData);
    return response.data.data;
}

export async function eliminarProyecto(proyectoId) {
    const response = await api.delete(`/proyectos/${proyectoId}`);
    return response.data.data;
}