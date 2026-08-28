import * as unidadMedidaRepository from "../repositories/unidadMedida.repository.js";

export const crear = async (data) => {
    return unidadMedidaRepository.crear({
        nombre: data.nombre,
        simbolo: data.simbolo,
    });
};


export const obtenerTodas = () => {
    return unidadMedidaRepository.obtenerTodas();
};

export const obtenerPorId = async (id) => {
    const unidad = await unidadMedidaRepository.obtenerPorId(id);

    if (!unidad) {
        const error = new Error("unidad de medida no encotrada");

        error.statusCode = 404;

        throw error;
    }
    return unidad;
};

export const actualizar = async (id,data) => {
    await obtenerPorId(id);

    return unidadMedidaRepository.actualizar(id,{
        nombre:data.nombre,
        simbolo:data.simbolo,
    });
};



