import { optional, z } from "zod";

export const detalleEntradaSchema = z.object({

    proyectoId: z
        .coerce
        .number()
        .int()
        .positive(),

    articuloId: z
        .coerce
        .number()
        .int()
        .positive(),

    cantidad: z
        .coerce
        .number()
        .positive,


});

export const crearEntradaSchema = z.object({
    folioFactura: z
        .string()
        .trim()
        .max(50)
        .optional(),

    foloRequisicion: z
        .string()
        .trim()
        .max(50)
        .optional(),

    fechaRecepcion: z
        .string()
        .datetime(),

    proveedor: z
        .string()
        .trim()
        .max(150)
        .optional(),

    distribuidor: z
        .string()
        .trim()
        .max(150)
        .optional(),

    observaciones: z
        .string()
        .trim()
        .max(30000)
        .optional(),

    detalles: z
        .array(detalleEntradaSchema)
        .min(1, "la entrada de conetener al menos un articulo"),

});