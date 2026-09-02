import api from "./api";

export async function getInventarioAlmacen(){
    const response = await api.get("/inventario/almacen");
    return response.data.data;
}
export async function getInventarioProyecto(proyectoId){
    const response = await api.get(`/inventario/${proyectoId}`);
    return response.data.data;
}

