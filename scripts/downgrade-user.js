const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function downgradeUser() {
    const email = "juancamargouch@gmail.com";

    const user = await prisma.user.update({
        where: { email: email },
        data: {
            isPro: false,
            proUntil: null
        }
    });

    console.log("=== MEMBRESÍA RESETEADA ===");
    console.log(`Usuario: ${user.email}`);
    console.log(`Estado Pro: ${user.isPro}`);
    console.log(`Expiración: ${user.proUntil}`);
    console.log("---------------------------");
}

downgradeUser()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
