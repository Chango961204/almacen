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
        .positive("La cantidad debe ser mayor a cero"),



});

export const crearEntradaSchema = z.object({
    folioFactura: z
        .string()
        .trim()
        .max(50)
        .optional()
        .or(z.literal("")),

    folioRequisicion: z
        .string()
        .trim()
        .max(50)
        .optional()
        .or(z.literal("")),


    fechaRecepcion: z
        .string()
        .datetime(),

    proveedor: z
        .string()
        .trim()
        .max(150)
        .optional()
        .or(z.literal("")),


    distribuidor: z
        .string()
        .trim()
        .max(150)
        .optional()
        .or(z.literal("")),


    observaciones: z
        .string()
        .trim()
        .max(30000)
        .optional()
        .or(z.literal("")),


    detalles: z
        .array(detalleEntradaSchema)
        .min(1, "la entrada de conetener al menos un articulo"),

});