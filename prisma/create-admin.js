const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    const adminEmail = "admin@qrfast.com"; // Puedes cambiar esto
    const adminPassword = "AdminPassword123!"; // Cambia esto inmediatamente después de entrar

    const hashedEmail = adminEmail.toLowerCase();

    const existingAdmin = await prisma.user.findUnique({
        where: { email: hashedEmail }
    });

    if (existingAdmin) {
        console.log("El usuario admin ya existe. Actualizando a rol ADMIN...");
        await prisma.user.update({
            where: { email: hashedEmail },
            data: { role: "ADMIN", isPro: true }
        });
        console.log("Usuario actualizado con éxito.");
    } else {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await prisma.user.create({
            data: {
                name: "Administrador Maestro",
                email: hashedEmail,
                password: hashedPassword,
                role: "ADMIN",
                isPro: true,
                proUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 10)) // 10 años de Pro
            }
        });
        console.log("--------------------------------------");
        console.log("¡ADMINISTRADOR CREADO CON ÉXITO!");
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log("--------------------------------------");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
