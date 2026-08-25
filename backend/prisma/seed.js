import bcrypt from "bcryptjs";
import prisma from "../src/lib/prisma.js";

async function main() {
    console.log("Ejecutando seed...");

    const roles = [
        {
            nombre: "SUPER_ADMIN",
        },
        {
            nombre: "ADMIN",
        },
        {
            nombre: "USUARIO",
        },
    ];

    for (const role of roles) {
        await prisma.rol.upsert({
            where: {
                nombre: role.nombre,
            },
            update: {},
            create: role,
        });
    }

    const superAdminRole = await prisma.rol.findUnique({
        where: {
            nombre: "SUPER_ADMIN",
        },
    });

    const passwordHash = await bcrypt.hash(
        "Battery..1",
        8
    );

    const usuario = await prisma.usuario.upsert({
        where: {
            email: "metallicaluis73@gmail.com",
        },
        update: {},
        create: {
            nombre: "Super Administrador",
            email: "metallicaluis73@gmail.com",
            password: passwordHash,
            activo: true,
            rolId: superAdminRole.id,
        },
        include: {
            rol: true,
        },
    });

    console.log("Usuario creado:");
    console.log({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol.nombre,
    });

    console.log("Cambia la contraseña después del primer acceso.");
}

main()
    .catch((error) => {
        console.error("Error ejecutando seed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });