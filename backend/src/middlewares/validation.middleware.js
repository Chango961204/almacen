export const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.succes) {
            return res.status(400).json({
                ok: false,
                message: "Datos Invalidos",
                errors: result.error.flatten(),
            });

        }
        req.body = result.data;
        next();
    };

};