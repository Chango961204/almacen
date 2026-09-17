export function authorizeRoles(...rolesPermitidos) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                succes: false,
                message: "No autenticado",
            });
        }

        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({
                succes: false,
                message: "No tienes permisos para realizar esta acción",
            });
        }
        next();
    };
}