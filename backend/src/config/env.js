import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),

    PORT: z.coerce.number().default(4000),

    DATABASE_URL: z.string().min(1),

    JWT_SECRET: z.string().min(32),

    JWT_EXPIRES_IN: z.string().default("15m"),

    COOKIE_NAME: z.string().default("inventario_token"),

    FRONTEND_URL: z.string().url(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error(" Variables de entorno inválidas:");

    console.error(
        result.error.flatten().fieldErrors
    );

    process.exit(1);
}

export const env = result.data;