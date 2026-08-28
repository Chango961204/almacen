import * as marcaRepository from "../repositories/marca.repository.js";

export const crear = async (data) => {
    const marcas = await marcaRepository.obetenerTodas();

    const existe = marcas.some(
        (marca) =>
            marca.nombre.toLocaleLowerCase() === data.nombre.toLocaleLowerCase()
    );

    if (existe) {
        const error = new Error("ya existe una marca con ese nombre");
        error.statusCode = 409;
        throw error;
    }

    return marcaRepository.crear({
        nombre: data.nombre,
    });
};

export const obtennerTodas = () => {
    return marcaRepository.obetenerTodas();
};

export const obtenerPorId = async (id) => {
    const marca = await marcaRepository.obtenerPorId(id);

    if (!marca) {
        const error = new Error("Marca no encontrada");
        error.satusCode = 404;
        throw error;
    }
    return marca;
};

export const actualizar = async (id, data) => {
    await obtenerPorId(id);

    return marcaRepository.actualizar(id, {
        nombre: data.nombre,
    });
};
