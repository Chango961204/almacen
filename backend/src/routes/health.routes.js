import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        status: "ok",
        message: "API funcionando correctamente",
    });
});

export default router;