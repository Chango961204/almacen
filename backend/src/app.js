import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.disable("x-powered-by");

app.use(
    helmet()
);

app.use(
    cors({
        origin: env.FRONTEND_URL,
        credentials: true,
    })
);

app.use(express.json({ limit: "10kb", }));

app.use(express.urlencoded({ extended: true, limit: "10kb", }));

app.use(cookieParser());

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message:
            "Demasiados intentos. Intenta nuevamente más tarde.",
    },
});

app.use("/api/auth/login", loginLimiter);

app.use(morgan("dev"));

app.use("/api", routes);

const frontendDist = path.join(__dirname, "../../frontend/dist");

if (existsSync(frontendDist)) {
    app.use(express.static(frontendDist));

    app.use((req, res, next) => {
        if (req.method !== "GET" || req.path.startsWith("/api")) {
            return next();
        }

        res.sendFile(path.join(frontendDist, "index.html"));
    });
}

app.use(errorMiddleware);

export default app;