import app from "./app.js";
import { env } from "./config/env.js";
import prisma from "./lib/prisma.js";

async function startServer() {
    try {
        await prisma.$connect();

        console.log(" Conectado a MySQL mediante Prisma");

        app.listen(env.PORT, () => {
            console.log(
                ` Servidor ejecutándose en http://localhost:${env.PORT}`
            );
        });
    } catch (error) {
        console.error(
            " No se pudo iniciar el servidor:",
            error
        );

        await prisma.$disconnect();

        process.exit(1);
    }
}

startServer();

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await prisma.$disconnect();
    process.exit(0);
});