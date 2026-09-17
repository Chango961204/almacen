import api from "./api";

function construirQuery(filtros = {}) {
    const params = new URLSearchParams();

    for (const [clave, valor] of Object.entries(filtros)) {
        if (valor) params.append(clave, valor);
    }

    const texto = params.toString();

    return texto ? `?${texto}` : "";
}

export async function getAuditorias(filtros = {}) {
    const response = await api.get(`/auditorias${construirQuery(filtros)}`);
    return response.data.data;
}